import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', withCredentials: true });
export const errMsg = (e: any) => e?.response?.data?.message || 'Something went wrong';
export type User = { id: string; name: string; email: string; role: 'candidate' | 'recruiter' | 'admin'; status: string };
