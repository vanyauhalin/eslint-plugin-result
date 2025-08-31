import assert from "node:assert/strict"
import test from "node:test"
import * as shared from "../test/shared.ts"
import * as plugin from "./plugin.ts"

void test("equals package.json", () => {
	assert.deepEqual({...plugin}, {
		name: shared.pack.name,
		version: shared.pack.version,
		repo: shared.pack.homepage,
	})
})
