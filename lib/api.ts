import Cookies from 'js-cookie'

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";
};

const BASE_URL = getBaseUrl();

export interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch(endpoint: string, options: ApiFetchOptions = {}) {
  const { auth = true, ...rest } = options
  const headers = new Headers(rest.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  if (auth) {
    const token = Cookies.get('quizlab_token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    console.error(`[API Error] ${rest.method || 'GET'} ${endpoint}:`, { status: response.status, data });
    const error = new Error(data?.message || 'Erro na requisição')
    ;(error as any).status = response.status
    ;(error as any).data = data
    throw error
  }

  return data
}
