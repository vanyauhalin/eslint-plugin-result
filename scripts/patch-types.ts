import fs from "node:fs/promises"

async function main(): Promise<void> {
	let p = await fs.readFile("lib/patch.ts", "utf8")
	p = p.slice(p.indexOf("declare"))

	let d = await fs.readFile("dist/main.d.ts", "utf8")
	d = `${d.trim()}\n\n${p.trim()}\n`

	await fs.writeFile("dist/main.d.ts", d)
}

void main()
