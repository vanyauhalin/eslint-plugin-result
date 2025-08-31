export type Defaulted<T extends readonly unknown[]> = T extends readonly (infer U)[] ?
	{[K in keyof U as U[K] extends undefined ? never : K]-?: Exclude<U[K], undefined>}[] :
	never
