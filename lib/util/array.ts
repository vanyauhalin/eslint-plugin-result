export function isEqual(a: string[], b: string[]): boolean {
	if (a.length !== b.length) {
		return false
	}

	for (let [i, e] of a.entries()) {
		if (e !== b[i]) {
			return false
		}
	}

	return true
}
