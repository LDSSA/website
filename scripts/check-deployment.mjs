const baseArgument = process.argv[2] ?? process.env.DEPLOYMENT_URL;
const aliasArgument = process.env.DEPLOYMENT_ALIAS_URL;
const expectedCommit = process.env.EXPECTED_COMMIT?.toLowerCase();
const expectedBranch = process.env.EXPECTED_BRANCH;
const expectNoindex = process.env.EXPECT_NOINDEX === "true";
const errors = [];

if (!baseArgument) {
  console.error("Provide the deployed URL as an argument or DEPLOYMENT_URL.");
  process.exit(1);
}

const normalizeBaseUrl = (value, label) => {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} is not a valid URL: ${value}`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`${label} must use HTTPS: ${value}`);
  }
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
};

let baseUrl;
let aliasUrl;
try {
  baseUrl = normalizeBaseUrl(baseArgument, "Deployment URL");
  aliasUrl = aliasArgument
    ? normalizeBaseUrl(aliasArgument, "Deployment alias URL")
    : undefined;
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const accessClientId = process.env.CF_ACCESS_CLIENT_ID;
const accessClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
if (Boolean(accessClientId) !== Boolean(accessClientSecret)) {
  console.error(
    "CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET must be supplied together.",
  );
  process.exit(1);
}

const headers = accessClientId
  ? {
      "CF-Access-Client-Id": accessClientId,
      "CF-Access-Client-Secret": accessClientSecret,
    }
  : {};

const request = (path, options = {}) =>
  fetch(new URL(path, baseUrl), {
    redirect: "manual",
    headers,
    signal: AbortSignal.timeout(15_000),
    ...options,
  });

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

let homeResponse;
for (let attempt = 1; attempt <= 6; attempt += 1) {
  try {
    homeResponse = await request("/");
    if (homeResponse.status === 200) break;
  } catch (error) {
    if (attempt === 6) errors.push(`Homepage request failed: ${error.message}`);
  }
  if (attempt < 6) await delay(5_000);
}

if (!homeResponse || homeResponse.status !== 200) {
  errors.push(`Homepage returned ${homeResponse?.status ?? "no response"}.`);
} else {
  const requiredHeaders = {
    "content-security-policy": "default-src 'self'",
    "permissions-policy": "camera=()",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  };
  for (const [name, expectedValue] of Object.entries(requiredHeaders)) {
    const actualValue = homeResponse.headers.get(name) ?? "";
    if (!actualValue.includes(expectedValue)) {
      errors.push(`${name} does not contain ${JSON.stringify(expectedValue)}.`);
    }
  }

  const contentSecurityPolicy =
    homeResponse.headers.get("content-security-policy") ?? "";
  if (
    !contentSecurityPolicy.includes("https://static.cloudflareinsights.com")
  ) {
    errors.push(
      "content-security-policy does not permit the Cloudflare Web Analytics beacon.",
    );
  }

  const robotsHeader = homeResponse.headers.get("x-robots-tag") ?? "";
  if (expectNoindex && !/\bnoindex\b/i.test(robotsHeader)) {
    errors.push("Preview deployment is missing X-Robots-Tag: noindex.");
  }
  if (!expectNoindex && /\bnoindex\b/i.test(robotsHeader)) {
    errors.push("Production deployment unexpectedly sends noindex.");
  }
}

for (const path of [
  "/starters-academy/",
  "/prep-course/",
  "/about-us/",
  "/jobs/",
  "/robots.txt",
  "/sitemap-index.xml",
]) {
  try {
    const response = await request(path);
    if (response.status !== 200)
      errors.push(`${path} returned ${response.status}.`);
  } catch (error) {
    errors.push(`${path} request failed: ${error.message}`);
  }
}

for (const [path, destination] of [
  ["/curriculum/", "/starters-academy/#curriculum"],
  ["/faq/", "/starters-academy/#faq"],
  ["/home", "/"],
  ["/index.html", "/"],
  ["/comms-associate-position/", "/about-us/"],
  ["/pythonzerotohero/", "/prep-course/"],
  ["/a-form_confirmation.html", "/"],
  ["/b-form_confirmation.html", "/"],
  ["/d-form_confirmation.html", "/"],
  ["/comms-associate-position/a-form_confirmation.html", "/about-us/"],
  ["/curriculum/a-form_confirmation.html", "/starters-academy/"],
]) {
  try {
    const response = await request(path);
    const location = response.headers.get("location");
    const actualDestination = location
      ? `${new URL(location, baseUrl).pathname}${new URL(location, baseUrl).hash}`
      : "";
    if (response.status !== 301 || actualDestination !== destination) {
      errors.push(
        `${path} expected 301 to ${destination}, received ${response.status} to ${location ?? "no location"}.`,
      );
    }
  } catch (error) {
    errors.push(`${path} redirect check failed: ${error.message}`);
  }
}

try {
  const response = await request("/__deployment-contract-missing-route__/");
  if (response.status !== 404) {
    errors.push(`Unknown route returned ${response.status} instead of 404.`);
  } else if (!(await response.text()).includes("Page not found")) {
    errors.push("Unknown route did not render the custom 404 page.");
  }
} catch (error) {
  errors.push(`404 check failed: ${error.message}`);
}

try {
  const response = await request("/deployment.json");
  if (response.status !== 200) {
    errors.push(`Deployment metadata returned ${response.status}.`);
  } else {
    const metadata = await response.json();
    if (expectedCommit && metadata.commit !== expectedCommit) {
      errors.push(
        `Expected commit ${expectedCommit}, deployment reports ${metadata.commit}.`,
      );
    }
    if (expectedBranch && metadata.branch !== expectedBranch) {
      errors.push(
        `Expected branch ${expectedBranch}, deployment reports ${metadata.branch}.`,
      );
    }
  }
} catch (error) {
  errors.push(`Deployment metadata check failed: ${error.message}`);
}

if (aliasUrl && expectedBranch && expectedBranch !== "main") {
  const expectedAlias = `${expectedBranch
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.`;
  if (!aliasUrl.hostname.startsWith(expectedAlias)) {
    errors.push(
      `Branch alias ${aliasUrl.hostname} does not start with ${expectedAlias}`,
    );
  }
}

if (errors.length > 0) {
  console.error(`Deployment contract checks failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Deployment contract checks passed for ${baseUrl.origin}.`);
