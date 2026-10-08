# Script inventory

| Existing script                               | Classification | Replacement                                                     |
| --------------------------------------------- | -------------- | --------------------------------------------------------------- |
| Unbounce runtime and conversion tracker       | Remove         | Cloudflare Pages hosting and Web Analytics                      |
| Unbounce jQuery 1.4.2 and compatibility shims | Remove         | Standards-based browser JavaScript for the mobile menu          |
| Unbounce form handler                         | Remove         | Direct Flodesk forms                                            |
| Google Analytics property `UA-113478482-1`    | Replace        | Cloudflare Web Analytics and Core Web Vitals                    |
| Flodesk universal form script                 | Keep           | Loaded only on pages that contain a Flodesk form                |
| YouTube iframe                                | Keep           | Privacy-enhanced `youtube-nocookie.com` embed with lazy loading |
| Generated animation observer                  | Remove         | Static CSS and reduced-motion support                           |

No Google Tag Manager, Meta Pixel or LinkedIn Insight Tag was found in the public rendered pages. Unbounce Script Manager remains an account-only audit item.
