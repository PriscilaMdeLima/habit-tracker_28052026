import { Habit } from '../types/Habit';
import { useAuthStore } from '../store/useAuthStore';

// Ajuste o IP ou porta conforme necessário para testes em dispositivos físicos (ex: http://192.168.x.x:3000/api)
// Para emuladores Android usando Expo: use 'http://10.0.2.2:3000/api' se localhost não funcionar
const API_URL = 'http://localhost:3000/api';

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = useAuthStore.getState().token;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchHabits(): Promise<Habit[]> {
  const response = await fetch(`${API_URL}/habits`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Falha ao buscar hábitos');
  return await response.json();
}

export async function toggleHabit(id: string): Promise<Habit> {
  const response = await fetch(`${API_URL}/habits/${id}/toggle`, { 
    method: 'PATCH',
    headers: getHeaders() 
  });
  if (!response.ok) throw new Error('Falha ao atualizar hábito');
  return await response.json();
}

export async function createHabit(data: Omit<Habit, 'id' | 'completedToday' | 'streak' | 'createdAt'>): Promise<Habit> {
  const response = await fetch(`${API_URL}/habits`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Falha ao criar hábito');
  return await response.json();
}

export async function deleteHabit(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/habits/${id}`, { 
    method: 'DELETE',
    headers: getHeaders() 
  });
  if (!response.ok) throw new Error('Falha ao excluir hábito');
}

// Authentication API
export async function loginAPI(data: any): Promise<{ token: string; user: any }> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Falha ao fazer login' }));
    throw new Error(err.error || 'Falha ao fazer login');
  }
  return await response.json();
}

export async function signupAPI(data: any): Promise<{ token: string; user: any }> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Falha ao criar conta' }));
    throw new Error(err.error || 'Falha ao criar conta');
  }
  return await response.json();
}

export async function logoutAPI(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Falha ao fazer logout');
}
