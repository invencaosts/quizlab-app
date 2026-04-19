import Cookies from 'js-cookie'

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // Se não for localhost, assume que estamos acessando via IP na rede local
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `http://${hostname}:3333/api/v1`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";
};

const BASE_URL = getBaseUrl();

interface RequestOptions extends RequestInit {
  auth?: boolean
}

export async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const { auth = false, ...rest } = options
  
  const headers = new Headers(options.headers)
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
    const error = new Error(data?.message || 'Erro na requisição')
    ;(error as any).status = response.status
    ;(error as any).data = data
    throw error
  }

  return data
}
