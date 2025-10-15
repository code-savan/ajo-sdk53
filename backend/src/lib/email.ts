export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL || 'Ajo <no-reply@resend.dev>'
  if (!apiKey) {
    // Silently skip if not configured
    return { success: false, skipped: true }
  }
  const body = {
    from,
    to,
    subject,
    html,
    ...(text ? { text } : {}),
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(()=> ({}))
    return { success: res.ok, data }
  } catch (e) {
    return { success: false, error: (e as any)?.message || 'sendEmail failed' }
  }
}
