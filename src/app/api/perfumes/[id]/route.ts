import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PERFUME_COLUMNS = [
  'name',
  'brand',
  'description',
  'status',
  'price_5ml',
  'price_10ml',
  'rating',
  'review_count',
  'image_url',
  'notes_top',
  'notes_middle',
  'notes_base',
  'accords',
  'when_to_wear',
  'gender',
] as const

function toPerfumePayload(body: Record<string, unknown>, includeGender = true) {
  return PERFUME_COLUMNS.reduce<Record<string, unknown>>((payload, column) => {
    if (column === 'gender' && !includeGender) return payload
    if (body[column] !== undefined) payload[column] = body[column]
    return payload
  }, {})
}

function isMissingGenderColumnError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    String(error.message).toLowerCase().includes('gender') &&
    String(error.message).toLowerCase().includes('schema cache')
  )
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Failed to save perfume.'
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const { data, error } = await supabase
    .from('perfumes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })        
  }

  try {
    const body = await request.json()
    const payload = toPerfumePayload(body)
    let { data, error } = await supabase
      .from('perfumes')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error && isMissingGenderColumnError(error)) {
      const fallback = await supabase
        .from('perfumes')
        .update(toPerfumePayload(body, false))
        .eq('id', id)
        .select()
        .single()

      data = fallback.data
      error = fallback.error
    }
      
    if (error) throw error

    return NextResponse.json(data)
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })        
  }

  const { error } = await supabase
    .from('perfumes')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
