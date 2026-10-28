import { flag } from 'flags/sveltekit';
import { vercelAdapter } from '@flags-sdk/vercel';
import { dev } from '$app/environment';

export const enableAltcha = flag<boolean>({
	key: 'enable-altcha',
	...(dev ? { decide: () => true } : { adapter: vercelAdapter() })
});

export const enableAltchaFallback = flag<boolean>({
	key: 'enable-altcha-fallback',
	...(dev ? { decide: () => true } : { adapter: vercelAdapter() })
});
