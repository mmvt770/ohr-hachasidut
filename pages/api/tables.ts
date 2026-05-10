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
      })
    }

    const data = await response.json()
    return res.status(200).json({ success: true, data })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
    })
  }
}
