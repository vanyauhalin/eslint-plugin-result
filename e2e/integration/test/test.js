import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import test from "node:test"

void test("compare snapshots", async () => {
	let d = process.cwd()

	let a = await fs.readFile("snapshots/actual.json", "utf8")
	let x = JSON.parse(a)

	for (let t of x) {
		t.filePath = path.relative(d, t.filePath)
	}

	let e = await fs.readFile("snapshots/expected.json", "utf8")
	let y = JSON.parse(e)

	assert.deepEqual(x, y)
})
