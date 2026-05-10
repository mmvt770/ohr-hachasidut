import axios, { AxiosInstance } from 'axios'

const AIRTABLE_API_URL = 'https://api.airtable.com/v0'

interface AirtableConfig {
  baseId: string
  apiKey: string
}

interface AirtableRecord<T> {
  id: string
  fields: T
  createdTime: string
}

interface AirtableResponse<T> {
  records: AirtableRecord<T>[]
  offset?: string
}

export class AirtableClient {
  private client: AxiosInstance
  private baseId: string

  constructor(config: AirtableConfig) {
    this.baseId = config.baseId
    this.client = axios.create({
      baseURL: `${AIRTABLE_API_URL}/${config.baseId}`,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
  }

  async getRecords<T>(
    tableName: string,
    options?: {
      view?: string
      fields?: string[]
      filterByFormula?: string
      maxRecords?: number
      pageSize?: number
    }
  ): Promise<AirtableRecord<T>[]> {
    try {
      const params = new URLSearchParams()
      
      if (options?.view) params.append('view', options.view)
      if (options?.fields) {
        options.fields.forEach(field => params.append('fields[]', field))
      }
      if (options?.filterByFormula) params.append('filterByFormula', options.filterByFormula)
      if (options?.maxRecords) params.append('maxRecords', options.maxRecords.toString())
      if (options?.pageSize) params.append('pageSize', options.pageSize.toString())

      const response = await this.client.get<AirtableResponse<T>>(
        `/${tableName}?${params.toString()}`
      )
      
      return response.data.records
    } catch (error) {
      console.error(`Error fetching records from ${tableName}:`, error)
      throw error
    }
  }

  async getRecord<T>(tableName: string, recordId: string): Promise<AirtableRecord<T>> {
    try {
      const response = await this.client.get<AirtableRecord<T>>(
        `/${tableName}/${recordId}`
      )
      return response.data
    } catch (error) {
      console.error(`Error fetching record ${recordId}:`, error)
      throw error
    }
  }

  async createRecord<T>(tableName: string, fields: T): Promise<AirtableRecord<T>> {
    try {
      const response = await this.client.post<AirtableRecord<T>>(
        `/${tableName}`,
        { fields }
      )
      return response.data
    } catch (error) {
      console.error(`Error creating record:`, error)
      throw error
    }
  }

  async updateRecord<T>(
    tableName: string,
    recordId: string,
    fields: Partial<T>
  ): Promise<AirtableRecord<T>> {
    try {
      const response = await this.client.patch<AirtableRecord<T>>(
        `/${tableName}/${recordId}`,
        { fields }
      )
      return response.data
    } catch (error) {
      console.error(`Error updating record ${recordId}:`, error)
      throw error
    }
  }

  async deleteRecord(tableName: string, recordId: string): Promise<boolean> {
    try {
      await this.client.delete(`/${tableName}/${recordId}`)
      return true
    } catch (error) {
      console.error(`Error deleting record ${recordId}:`, error)
      throw error
    }
  }

  async batchUpdate<T>(
    tableName: string,
    records: Array<{ id: string; fields: Partial<T> }>
  ): Promise<AirtableRecord<T>[]> {
    try {
      const response = await this.client.patch<{ records: AirtableRecord<T>[] }>(
        `/${tableName}`,
        { records }
      )
      return response.data.records
    } catch (error) {
      console.error(`Error batch updating records:`, error)
      throw error
    }
  }
}

export function getAirtableClient(): AirtableClient {
  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID
  const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY

  if (!baseId || !apiKey) {
    throw new Error('Airtable credentials not configured')
  }

  return new AirtableClient({ baseId, apiKey })
}
