import type * as utils from "@typescript-eslint/utils"

export type D<
	C extends Readonly<utils.TSESLint.RuleContext<string, readonly unknown[]>>,
> = Parameters<C["report"]>[0]

export type F<
	C extends Readonly<utils.TSESLint.RuleContext<string, readonly unknown[]>>,
> = Exclude<D<C>["fix"], null | undefined>
