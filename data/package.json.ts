// Have to read the package.json manually instead of importing with json
// attribute to be able to work with older versions of Node.js.

import fs from "node:fs"

export type PackageJson = {
	name: string
	version: string
	homepage: string
	main: string
	dependencies: Record<string, string>
	peerDependencies: Record<string, string>
}

const pack = ((): PackageJson => {
	let c = fs.readFileSync("package.json", "utf8")
	return JSON.parse(c)
})()

// Use default export to be similar to importing with json attribute.
// eslint-disable-next-line import-x/no-default-export
export default pack
