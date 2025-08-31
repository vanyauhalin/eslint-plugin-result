import * as esbuild from "esbuild"
import * as shared from "../lib/test/shared.ts"
import * as tsconfig from "./tsconfig.ts"

async function main(): Promise<void> {
	let c = await tsconfig.load(process)
	let o: esbuild.BuildOptions = {
		bundle: true,
		entryPoints: [...c.files],
		external: [
			...Object.keys(shared.pack.dependencies),
			...Object.keys(shared.pack.peerDependencies),
		],
		format: "esm",
		logLevel: "error",
		outfile: shared.pack.main,
		platform: "node",
		target: c.compilerOptions.target,
		tsconfigRaw: c,
	}
	await esbuild.build(o)
}

void main()
