export async function sendExpoPush(tokens: string[], title: string, body: string, data?: any) {
  if (!tokens || tokens.length === 0) return { success: true, sent: 0 }
  const chunks: string[][] = []
  for (let i = 0; i < tokens.length; i += 90) chunks.push(tokens.slice(i, i + 90))

  let sent = 0
  for (const chunk of chunks) {
    const messages = chunk.map(t => ({ to: t, title, body, sound: 'default', data: data || {} }))
    try {
      const res = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messages)
      })
      const txt = await res.text().catch(()=> '')
      if (res.ok) {
        sent += messages.length
        console.log('[push] sent', { count: messages.length, status: res.status, body: txt })
      } else {
        console.warn('[push] send failed', { status: res.status, body: txt })
      }
    } catch {}
  }
  return { success: true, sent }
}
