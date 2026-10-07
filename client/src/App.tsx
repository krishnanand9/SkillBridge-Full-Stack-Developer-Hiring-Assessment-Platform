import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, User } from './api';
import { Login, Register } from './pages/Auth'; import Jobs from './pages/Jobs'; import Dashboard from './pages/Dashboard';
import Assessments, { TakeAssessment } from './pages/Assessments'; import { Applications, Applicants, PostJob } from './pages/Hiring'; import Admin from './pages/Admin';
export const useMe = () => useQuery<User | null>({ queryKey: ['me'], retry: false, queryFn: () => api.get('/auth/me').then((r) => r.data).catch(() => null) });
function Guard({ roles, children }: { roles?: string[]; children: JSX.Element }) {
  const { data: u, isLoading } = useMe(); if (isLoading) return <p className="p-8">Loading…</p>;
  if (!u) return <Navigate to="/login" replace />; if (roles && !roles.includes(u.role)) return <Navigate to="/dashboard" replace />; return children;
}
function Nav() {
  const { data: u } = useMe(); const qc = useQueryClient(); const nav = useNavigate();
  const out = async () => { await api.post('/auth/logout'); qc.setQueryData(['me'], null); qc.clear(); nav('/login'); };
  const links: [string, string, string?][] = [['/jobs', 'Jobs'], ...(u?.role === 'candidate' ? [['/applications', 'Applications'], ['/assessments', 'Assessments']] : []),
    ...(u?.role === 'recruiter' ? [['/post-job', 'Post job'], ['/applicants', 'Applicants'], ['/assessments', 'Assessments']] : []), ...(u?.role === 'admin' ? [['/admin', 'Admin']] : []), ...(u ? [['/dashboard', 'Dashboard']] : [])] as any;
  return <nav className="flex flex-wrap items-center gap-4 border-b bg-white px-6 py-3 dark:bg-slate-900 dark:border-slate-700"><Link to="/" className="font-bold text-indigo-600">SkillBridge</Link>
    {links.map(([to, t]) => <Link key={to} to={to} className="text-sm hover:underline">{t}</Link>)}<span className="flex-1" />
    <button className="text-sm" onClick={() => document.documentElement.classList.toggle('dark')}>Theme</button>
    {u ? <button className="btn" onClick={out}>Logout</button> : <Link className="btn" to="/login">Login</Link>}</nav>;
}
export default function App() {
  return <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"><Nav /><main className="mx-auto max-w-5xl p-6"><Routes>
    <Route path="/" element={<Navigate to="/jobs" replace />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/jobs" element={<Jobs />} />
    <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
    <Route path="/applications" element={<Guard roles={['candidate']}><Applications /></Guard>} />
    <Route path="/assessments" element={<Guard roles={['candidate', 'recruiter']}><Assessments /></Guard>} />
    <Route path="/assessments/:id/take" element={<Guard roles={['candidate']}><TakeAssessment /></Guard>} />
    <Route path="/post-job" element={<Guard roles={['recruiter']}><PostJob /></Guard>} />
    <Route path="/applicants" element={<Guard roles={['recruiter']}><Applicants /></Guard>} />
    <Route path="/admin" element={<Guard roles={['admin']}><Admin /></Guard>} />
    <Route path="*" element={<p>Page not found</p>} /></Routes></main></div>;
}
