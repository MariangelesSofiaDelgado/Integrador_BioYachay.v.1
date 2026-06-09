
const BASE_URL = "http://localhost:8080/api";

export interface AuthUser {
  token: string;
  id: number;
  nombre: string;
  email: string;
  avatarColor: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  dni: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error || data?.message || "Error del servidor";
    throw new Error(msg);
  }
  return data as AuthUser;
}

export async function registrar(data: RegisterData): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function login(data: LoginData): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
