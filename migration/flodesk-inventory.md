# Flodesk integration inventory

The live forms were recovered from rendered public HTML. Their endpoint, form ID, success mode and interest values are preserved in `src/components/FlodeskForm.astro`.

| Purpose                                 | Page                 | Form ID                    | Submission endpoint                                              | Completion behavior     |
| --------------------------------------- | -------------------- | -------------------------- | ---------------------------------------------------------------- | ----------------------- |
| General newsletter and course interests | `/`                  | `63f9e4e2f0116a4cabfef7db` | `https://form.flodesk.com/forms/63f9e4e2f0116a4cabfef7db/submit` | Inline success message  |
| Starters Academy waiting list           | `/starters-academy/` | `615c9641c71e8685f183bd18` | `https://form.flodesk.com/forms/615c9641c71e8685f183bd18/submit` | Redirect to site root   |
| Prep Course waiting list                | `/prep-course/`      | `6172e62fe625581864e3f857` | `https://form.flodesk.com/forms/6172e62fe625581864e3f857/submit` | Redirect to Prep Course |

The general form uses these Flodesk preference values:

| Value     | Label                                |
| --------- | ------------------------------------ |
| `option1` | Lisbon Data Science Starters Academy |
| `option2` | Data Science Prep Course             |

The Flodesk universal script progressively enhances the native forms. The component mirrors the public embed's current module/legacy loader pair, while the native `POST` action remains present as a fallback. On 2026-10-09 both public runtime files returned HTTP 200 and all three endpoints returned HTTP 405 with `Allow: POST`, confirming that the integration resources and form handlers exist without creating test subscribers.

A real submission must still be checked against the expected Flodesk segment and automation before production cutover; rendering and HTTP-level checks cannot prove subscriber routing inside the Flodesk account. Use separate controlled LDSA addresses for each routing case in the QA runbook.
