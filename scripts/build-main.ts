import * as esbuild from "esbuild"
import pack from "../data/package.json.ts"
import * as tsconfig from "../data/tsconfig.json.ts"

async function main(): Promise<void> {
	let c = await tsconfig.load(process)
	let o: esbuild.BuildOptions = {
		bundle: true,
		entryPoints: [...c.files],
		external: [
			...Object.keys(pack.dependencies),
			...Object.keys(pack.peerDependencies),
		],
		format: "esm",
		logLevel: "error",
		outfile: pack.main,
		platform: "node",
		target: c.compilerOptions.target,
		tsconfigRaw: c,
	}
	await esbuild.build(o)
}

void main()
