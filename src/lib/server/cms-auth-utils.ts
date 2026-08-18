import { env } from '$env/dynamic/private';

/**
 * List of supported OAuth providers.
 */
export const supportedProviders = ['github', 'gitlab'] as const;

export type Provider = (typeof supportedProviders)[number];

export interface ProviderConfig {
	clientIdKey: string;
	clientSecretKey: string;
	hostnameKey: string;
	defaultHostname: string;
}

/**
 * Provider-specific configuration mappings.
 */
export const providerConfigs: Record<Provider, ProviderConfig> = {
	github: {
		clientIdKey: 'CMS_GITHUB_CLIENT_ID',
		clientSecretKey: 'CMS_GITHUB_CLIENT_SECRET',
		hostnameKey: 'CMS_GITHUB_HOSTNAME',
		defaultHostname: 'github.com'
	},
	gitlab: {
		clientIdKey: 'CMS_GITLAB_CLIENT_ID',
		clientSecretKey: 'CMS_GITLAB_CLIENT_SECRET',
		hostnameKey: 'CMS_GITLAB_HOSTNAME',
		defaultHostname: 'gitlab.com'
	}
};

/**
 * Escape the given string for safe use in a regular expression.
 * @param {string} str - Original string.
 * @returns {string} Escaped string.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
 */
export const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Get OAuth credentials for a provider.
 * @param {Provider} provider - The provider name.
 * @returns {Object} Object with clientId, clientSecret, and hostname.
 */
export const getProviderCredentials = (provider: Provider) => {
	const config = providerConfigs[provider];
	const clientId = (env as any)[config.clientIdKey];
	const clientSecret = (env as any)[config.clientSecretKey];
	const hostname = (env as any)[config.hostnameKey] || config.defaultHostname;

	return { clientId, clientSecret, hostname };
};

/**
 * Output HTML response that communicates with the window opener.
 * @param {object} args - Options.
 * @param {string} [args.provider] - Backend name, e,g. `github`.
 * @param {string} [args.token] - OAuth token.
 * @param {string} [args.error] - Error message when an OAuth token is not available.
 * @param {string} [args.errorCode] - Error code to be used to localize the error message in
 * Sveltia CMS.
 * @returns {Response} Response with HTML.
 */
export const outputHTML = ({ provider = 'unknown', token, error, errorCode }: any) => {
	const state = error ? 'error' : 'success';
	const content = error ? { provider, error, errorCode } : { provider, token };

	return new Response(
		`
      <!doctype html><html><body><script>
        (() => {
          window.addEventListener('message', ({ data, origin }) => {
            if (data === 'authorizing:${provider}') {
              window.opener?.postMessage(
                'authorization:${provider}:${state}:${JSON.stringify(content)}',
                origin
              );
            }
          });
          window.opener?.postMessage('authorizing:${provider}', '*');
        })();
      </script></body></html>
    `,
		{
			headers: {
				'Content-Type': 'text/html;charset=UTF-8',
				// Delete CSRF token
				'Set-Cookie': `csrf-token=deleted; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure`
			}
		}
	);
};
