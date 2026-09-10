import { flag } from 'flags/sveltekit';
import { vercelAdapter } from '@flags-sdk/vercel';

export const enableAltcha = flag<boolean>({
	key: 'enable-altcha',
	adapter: vercelAdapter(),
});

export const enableAltchaFallback = flag<boolean>({
	key: 'enable-altcha-fallback',
	adapter: vercelAdapter()
});
