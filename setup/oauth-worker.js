// ============================================================
// INVENTRA — Decap CMS GitHub OAuth proxy (Cloudflare Worker)
// Lets /admin log in with GitHub on a static host (GitHub Pages).
// No secrets live in the browser — they're Worker variables.
//
// Setup (see OAUTH-SETUP.md):
//   1. Create a GitHub OAuth App; note Client ID + Client Secret.
//   2. Deploy this Worker; add CLIENT_ID and CLIENT_SECRET as
//      Worker Variables/Secrets.
//   3. Set the OAuth App "Authorization callback URL" to:
//          https://<your-worker-url>/callback
//   4. Put the Worker URL into admin/config.yml -> backend.base_url
// ============================================================

const GH_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GH_TOKEN = 'https://github.com/login/oauth/access_token';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const CLIENT_ID = env.CLIENT_ID;
    const CLIENT_SECRET = env.CLIENT_SECRET;

    // Health check
    if (url.pathname === '/' || url.pathname === '') {
      return new Response('INVENTRA Decap OAuth proxy is running.', {
        headers: { 'content-type': 'text/plain' },
      });
    }

    // Step 1 — start the GitHub OAuth flow
    if (url.pathname === '/auth') {
      const redirectUri = `${url.origin}/callback`;
      const authorize = new URL(GH_AUTHORIZE);
      authorize.searchParams.set('client_id', CLIENT_ID);
      authorize.searchParams.set('redirect_uri', redirectUri);
      authorize.searchParams.set('scope', url.searchParams.get('scope') || 'repo,user');
      authorize.searchParams.set('state', crypto.randomUUID());
      return Response.redirect(authorize.toString(), 302);
    }

    // Step 2 — GitHub redirects back here with a code
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Missing ?code', { status: 400 });

      const tokenRes = await fetch(GH_TOKEN, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json',
          'user-agent': 'inventra-decap-oauth',
        },
        body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
      });
      const result = await tokenRes.json();

      const status = result.access_token ? 'success' : 'error';
      const payload = result.access_token
        ? { token: result.access_token, provider: 'github' }
        : { error: result.error || 'no_token' };

      // Hand the token back to the Decap CMS window via postMessage
      const html = `<!doctype html><html><head><meta charset="utf-8"></head>
<body>Completing sign-in…
<script>
  (function () {
    var data = ${JSON.stringify(payload)};
    var status = ${JSON.stringify(status)};
    function receiveMessage(e) {
      window.opener && window.opener.postMessage(
        'authorization:github:' + status + ':' + JSON.stringify(data), e.origin);
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener && window.opener.postMessage('authorizing:github', '*');
  })();
</script></body></html>`;
      return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } });
    }

    return new Response('Not found', { status: 404 });
  },
};
