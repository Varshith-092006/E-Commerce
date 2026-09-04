const API_BASE = '/api/v1';

let inMemoryAccessToken = null;

export function setAccessToken(token) {
  inMemoryAccessToken = token;
}

export function getAccessToken() {
  return inMemoryAccessToken;
}

export async function apiRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (inMemoryAccessToken) {
    requestHeaders['Authorization'] = `Bearer ${inMemoryAccessToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.error?.message || 'API request failed');
    error.status = response.status;
    error.code = data?.error?.code;
    error.details = data?.error?.details;
    throw error;
  }

  return data.data;
}
