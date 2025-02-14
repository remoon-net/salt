import type { Config, Status } from '$lib/config'
import { status } from '$lib/fake.data'
import xhe from '$lib/xhe'

export async function load() {
	const s = await xhe.get('status')
	const status = JSON.parse(s) as Status
	return {
		status: status,
	}
}
