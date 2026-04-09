import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/DB/server'

export async function POST(req: NextRequest) {
  const { uid, email, displayName } = await req.json()

  if (!uid) return NextResponse.json({ error: 'Missing uid' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('users')
    .upsert({
      id: uid,
      email: email ?? '',
      display_name: displayName ?? '',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

  if (error) {
    console.error('[auth/sync] upsert failed:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}