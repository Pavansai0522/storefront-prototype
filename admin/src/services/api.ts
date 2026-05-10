export const apiFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const token = localStorage.getItem('admin_jwt');
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }
  const text = await res.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
};
