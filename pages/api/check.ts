import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const baseId = process.env.AIRTABLE_BASE_ID
  const apiKey = process.env.AIRTABLE_API_KEY

  if (!baseId || !apiKey) {
    return res.status(500).json({
      success: false,
      error: 'Airtable credentials not configured',
      hasBaseId: !!baseId,
      hasApiKey: !!apiKey,
      message: 'Add AIRTABLE_BASE_ID and AIRTABLE_API_KEY to Vercel Environment Variables',
    })
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      return res.status(response.status).json({
        success: false,
        error: `Airtable error: ${error}`,
        statusCode: response.status,
      })
    }

    const data = await response.json()
    
    // עיבוד התוצאה לתצוגה נוחה
    const tables = data.tables.map((table: any) => ({
      id: table.id,
      name: table.name,
      primaryFieldId: table.primaryFieldId,
      fields: table.fields.map((field: any) => ({
        id: field.id,
        name: field.name,
        type: field.type,
        options: field.options,
      })),
      views: table.views?.map((v: any) => ({ id: v.id, name: v.name, type: v.type })),
    }))

    return res.status(200).json({
      success: true,
      baseId,
      tablesCount: tables.length,
      tables,
    })
  } catch (error: any) {
    console.error('Airtable error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
    })
  }
}
