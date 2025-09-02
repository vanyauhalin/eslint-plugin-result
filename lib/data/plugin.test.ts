import assert from "node:assert/strict"
import test from "node:test"
import pack from "../../data/package.json.ts"
import * as plugin from "./plugin.ts"

void test("equals package.json", () => {
	assert.deepEqual({...plugin}, {
		name: pack.name,
		version: pack.version,
		repo: pack.homepage,
	})
})
