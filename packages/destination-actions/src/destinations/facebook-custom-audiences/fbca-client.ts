import { DynamicFieldResponse } from '@segment/actions-core'
import { RequestClient } from '@segment/actions-core'
import { createHash } from 'crypto'

const API_VERSION = 'v16.0'
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`

const hash = (value: string | undefined): string | undefined => {
  if (value === undefined) return

  const hash = createHash('sha256')
  hash.update(value)
  return hash.digest('hex')
}

interface GetAudiencesResponse {
  data: [
    {
      name: string
      id: string
    }
  ]
}

export interface CreateAudienceParams {
  name: string
  description: string | undefined
  claimObjective: string | undefined
  customerFileSource: string | undefined
}
export default class Facebook {
  request: RequestClient
  accountId: string
  accessToken: string // Testing/PoC only

  constructor(request: RequestClient, accountId: string, accessToken: string) {
    this.request = request
    this.accountId = accountId
    this.accessToken = accessToken
  }

  createAudience = async (bundle: CreateAudienceParams) => {
    return this.request(`${BASE_URL}/${this.accountId}/customaudiences`, {
      method: 'POST',
      json: {
        name: bundle.name,
        subtype: 'CUSTOM',
        customer_file_source: bundle.customerFileSource,
        enable_fetch_or_create: true
      },
      headers: {
        authorization: `Bearer ${this.accessToken}`
      }
    })
  }

  updateAudience = async (audienceId: string, schema: string, email: string) => {
    return this.request(`${BASE_URL}/${audienceId}/users`, {
      method: 'POST',
      json: {
        payload: {
          schema: schema,
          data: [hash(email)]
        }
      },
      headers: {
        authorization: `Bearer ${this.accessToken}`
      }
    })
  }

  getAllAudiences = async (): Promise<DynamicFieldResponse> => {
    const NUM_AUDIENCES = 500
    try {
      const result = await this.request<GetAudiencesResponse>(
        `${BASE_URL}/${this.accountId}/customaudiences?fields=name&limit=${NUM_AUDIENCES}`,
        {
          method: 'GET',
          skipResponseCloning: true,
          headers: {
            authorization: `Bearer ${this.accessToken}`
          }
        }
      )
      console.log(result.data.data.length)
      const choices = result.data.data.map((audience) => {
        return { value: audience.id, label: audience.name }
      })
      return {
        choices: choices
      }
    } catch (err) {
      console.log(err)
      return {
        choices: []
      }
    }
  }
}