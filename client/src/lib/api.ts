import { config } from './config';

export const API_BASE_URL = config.apiUrl;

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown | undefined,
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }

  return res;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await apiRequest('GET', endpoint);
  return res.json();
}

export async function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  const res = await apiRequest('POST', endpoint, data);
  return res.json();
}

export async function apiPut<T>(endpoint: string, data?: unknown): Promise<T> {
  const res = await apiRequest('PUT', endpoint, data);
  return res.json();
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const res = await apiRequest('DELETE', endpoint);
  return res.json();
} 