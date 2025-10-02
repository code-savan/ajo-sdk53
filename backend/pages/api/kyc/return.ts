import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  const deepLink = 'ajo://kyc/return'
  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Returning to app…</title>
      <style>
        body { font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 24px; }
        a { color: #2563eb; text-decoration: none; }
      </style>
      <script>
        window.onload = function() {
          setTimeout(function(){ window.location = '${deepLink}'; }, 100);
        };
      </script>
    </head>
    <body>
      <h3>Verification complete</h3>
      <p>You can return to the app now. If nothing happens, tap the link below:</p>
      <p><a href="${deepLink}">Open the app</a></p>
    </body>
  </html>`
  res.status(200).setHeader('Content-Type', 'text/html').end(html)
}
