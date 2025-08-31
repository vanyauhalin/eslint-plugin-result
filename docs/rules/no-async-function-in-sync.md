# no-async-function-in-sync

💼 This rule is enabled in the ✅ `recommended` config.

💭 This rule requires [type information].

## Rule details

Disallow async functions as the first argument to [`safeSync`] calls. Prefer to
use [`safeAsync`] for async functions.

Examples of **incorrect** code for this rule:

```js
import * as result from "@vanyauhalin/result"

async function fn() {}

result.safeSync(fn)
```

Examples of **correct** code for this rule:

```js
import * as result from "@vanyauhalin/result"

async function fn() {}

result.safeAsync(fn)
```

## Resources

- [Rule source]
- [Test source]

<!-- Definitions -->

[type information]: https://typescript-eslint.io/linting/typed-linting

[`safeSync`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safesyncfn-args
[`safeAsync`]: https://github.com/vanyauhalin/result/blob/v0.0.0/README.md#safeasyncfn-args

[Rule source]: ../../lib/rules/no-async-function-in-sync.ts
[Test source]: ../../lib/rules/no-async-function-in-sync.test.ts
