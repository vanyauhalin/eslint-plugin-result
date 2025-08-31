/* eslint-disable no-restricted-syntax */
/* eslint-disable typescript/consistent-type-definitions */
// https://github.com/microsoft/rushstack/issues/1709/
// https://github.com/microsoft/rushstack/issues/2090/
// https://github.com/microsoft/rushstack/issues/3000/

import type {Settings} from "./util/rule.ts"

declare module "@typescript-eslint/utils/ts-eslint" {
	interface SharedConfigurationSettings {
		result?: Settings
	}
}
