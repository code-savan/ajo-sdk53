import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end('Method Not Allowed')
    }

    const secret = req.headers['x-cron-secret'] || req.query.secret
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const nowIso = new Date().toISOString()
    const { data: groups, error } = await supabase
      .from('groups')
      .select('id')
      .eq('status', 'active')
      .lte('next_charge_at', nowIso)
      .limit(25)

    if (error) {
      return res.status(500).json({ success: false, error: error.message })
    }

    const dueIds = (groups || []).map(g => g.id)

    // Fire-and-forget calls to execute endpoint; in production, invoke internal function or queue jobs
    const base = process.env.PUBLIC_BASE_URL?.replace(/\/$/, '') || ''
    await Promise.allSettled(
      dueIds.map(id => fetch(`${base}/api/groups/${id}/rotate/execute`, { method: 'POST', headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } }))
    )

    return res.json({ success: true, data: { due_group_ids: dueIds } })
  } catch (e: any) {
    return res.status(500).json({ success: false, error: 'Cron error' })
  }
}
