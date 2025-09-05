import fs from "node:fs/promises"

async function main(): Promise<void> {
	let m = await fs.readFile("lib/main.ts", "utf8")
	m = m.replace('export * from "./patch.ts"\n', "")
	await fs.writeFile("lib/main.ts", m)
	await fs.rm("lib/patch.ts")
}

void main()
