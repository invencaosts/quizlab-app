import Cookies from 'js-cookie'

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `http://${hostname}:3333/api/v1`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";
};

const BASE_URL = getBaseUrl();

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  const token = Cookies.get('quizlab_token')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, { status: response.status, data });
    const error = new Error(data?.message || 'Erro na requisição')
    ;(error as any).status = response.status
    ;(error as any).data = data
    throw error
  }

  return data
}
