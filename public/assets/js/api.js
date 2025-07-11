export async function ajax(url, method = 'GET', body = null) {
  const r = await fetch(`/api/${url}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
  })
  const d = await r.json()
  return r.ok ? d : Promise.reject(d)
}

export default {
  post: async (uri, data) => ajax(uri, 'POST', data),
  get: async (uri) => ajax(uri),
  put: async (uri, data) => ajax(uri, 'PUT', data),
  delete: async (uri) => ajax(uri, 'DELETE'),
}