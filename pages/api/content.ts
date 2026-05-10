import type { NextApiRequest, NextApiResponse } from 'next'

const AIRTABLE_API_URL = 'https://api.airtable.com/v0'
const TABLE_NAME = 'תוכן' // שם הטבלה - יותאם בהתאם

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const baseId = process.env.AIRTABLE_BASE_ID
  const apiKey = process.env.AIRTABLE_API_KEY

  if (!baseId || !apiKey) {
    return res.status(500).json({
      success: false,
      error: 'Airtable credentials not configured. Add AIRTABLE_BASE_ID and AIRTABLE_API_KEY to environment variables.',
    })
  }

  const url = `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(TABLE_NAME)}`

  try {
    if (req.method === 'GET') {
      // קבלת רשומות
      const params = new URLSearchParams()
      
      if (req.query.view) params.append('view', req.query.view as string)
      if (req.query.filterByFormula) {
        params.append('filterByFormula', req.query.filterByFormula as string)
      }
      if (req.query.maxRecords) {
        params.append('maxRecords', req.query.maxRecords as string)
      }

      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        const error = await response.text()
        return res.status(response.status).json({
          success: false,
          error: `Airtable error: ${error}`,
        })
      }

      const data = await response.json()
      return res.status(200).json({ success: true, data: data.records })
    }

    if (req.method === 'POST') {
      // יצירת רשומה חדשה
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: req.body }),
      })

      if (!response.ok) {
        const error = await response.text()
        return res.status(response.status).json({
          success: false,
          error: `Airtable error: ${error}`,
        })
      }

      const data = await response.json()
      return res.status(200).json({ success: true, data })
    }

    if (req.method === 'PATCH') {
      // עדכון רשומה
      const { id, ...fields } = req.body
      
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing record ID' })
      }

      const response = await fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      })

      if (!response.ok) {
        const error = await response.text()
        return res.status(response.status).json({
          success: false,
          error: `Airtable error: ${error}`,
        })
      }

      const data = await response.json()
      return res.status(200).json({ success: true, data })
    }

    if (req.method === 'DELETE') {
      // מחיקת רשומה
      const { id } = req.query

      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing record ID' })
      }

      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        const error = await response.text()
        return res.status(response.status).json({
          success: false,
          error: `Airtable error: ${error}`,
        })
      }

      return res.status(200).json({ success: true, message: 'Record deleted' })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error: any) {
    console.error('API error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
    })
  }
}
