'use server'

import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify document ownership before deletion
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !doc || doc.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Document not found or unauthorized' },
        { status: 404 }
      )
    }

    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (deleteError) throw deleteError

    return NextResponse.json({
      success: true,
      message: 'Document deleted',
    })
  } catch (error) {
    console.error('[v0] Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
