import { APIError, RequestClient } from '@segment/actions-core'
import { API_URL } from './config'
import { KlaviyoAPIError, ProfileData, listData } from './types'

export async function addProfileToList(request: RequestClient, method: 'DELETE' | 'POST', id: string, list_id: string) {
  const listData: listData = {
    data: [
      {
        type: 'profile',
        id: id
      }
    ]
  }

  try {
    const list = await request(`${API_URL}/lists/${list_id}/relationships/profiles/`, {
      method: method,
      json: listData
    })
    return list
  } catch (error) {
    const { response } = error as KlaviyoAPIError
    if (response?.status === 409) {
      const content = JSON.parse(response?.content)
      const id = content?.errors[0]?.meta?.duplicate_profile_id
      listData.data[0].id = id
      const list = await request(`${API_URL}/lists/${list_id}/relationships/profiles/`, {
        method: method,
        json: listData
      })
      return list
    }
    throw new APIError('An error occured while adding profile to list', 400)
  }
}

export async function getProfile(request: RequestClient, email: string) {
  const profile = await request(`${API_URL}/profiles/?filter=equals(email,"${email}")`, {
    method: 'GET'
  })
  return profile.json()
}

export async function createProfile(request: RequestClient, email: string) {
  const profileData: ProfileData = {
    data: {
      type: 'profile',
      attributes: {
        email
      }
    }
  }

  const profile = await request(`${API_URL}/profiles/`, {
    method: 'POST',
    json: profileData
  })
  return profile.json()
}
