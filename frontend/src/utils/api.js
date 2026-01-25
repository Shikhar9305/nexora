export const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "API error")
  return data
}
