import { useState } from 'react'; import { useQuery, useQueryClient } from '@tanstack/react-query'; import toast from 'react-hot-toast'; import { api, errMsg } from '../api';
const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
export function Applications() {
  const { data, isLoading } = useQuery({ queryKey: ['apps'], queryFn: () => api.get('/applications/mine').then((r) => r.data) });
  if (isLoading) return <p>Loading…</p>; if (!data?.length) return <p className="card">No applications yet.</p>;
  return <div className="space-y-2">{data.map((a: any) => <div key={a._id} className="card flex justify-between"><span>{a.job?.title} — {a.job?.company}</span><b>{a.stage}</b></div>)}</div>;
}
export function Applicants() {
  const qc = useQueryClient(); const { data, isLoading } = useQuery({ queryKey: ['applicants'], queryFn: () => api.get('/recruiter/applicants').then((r) => r.data) });
  const move = async (id: string, stage: string) => { try { await api.patch(`/applications/${id}/stage`, { stage }); qc.invalidateQueries({ queryKey: ['applicants'] }); } catch (e) { toast.error(errMsg(e)); } };
  if (isLoading) return <p>Loading…</p>; if (!data?.length) return <p className="card">No applicants yet.</p>;
  return <div className="space-y-2">{data.map((a: any) => <div key={a._id} className="card flex flex-wrap items-center justify-between gap-2"><div><b>{a.candidate.name}</b> <span className="text-sm text-slate-500">{a.candidate.email} · {a.job.title}</span>
    <p className="text-xs">{a.profile?.skills?.join(', ')}</p></div><select className="input max-w-40" value={a.stage} onChange={(e) => move(a._id, e.target.value)}>{STAGES.map((s) => <option key={s}>{s}</option>)}</select></div>)}</div>;
}
export function PostJob() {
  const [f, setF] = useState({ title: '', company: '', location: '', type: 'full-time', skills: '', description: '' }); const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const submit = async (e: React.FormEvent) => { e.preventDefault(); try { await api.post('/jobs', { ...f, skills: f.skills.split(',').map((s) => s.trim()).filter(Boolean) }); toast.success('Job posted'); } catch (x) { toast.error(errMsg(x)); } };
  return <form onSubmit={submit} className="card max-w-lg space-y-2"><h1 className="font-semibold">Post a job</h1>{['title', 'company', 'location'].map((k) => <input key={k} className="input" placeholder={k} required value={(f as any)[k]} onChange={set(k)} />)}
    <select className="input" value={f.type} onChange={set('type')}>{['full-time', 'part-time', 'contract', 'internship'].map((t) => <option key={t}>{t}</option>)}</select>
    <input className="input" placeholder="Skills (comma separated)" value={f.skills} onChange={set('skills')} /><textarea className="input" placeholder="Description (min 10 chars)" required minLength={10} value={f.description} onChange={set('description')} /><button className="btn">Publish</button></form>;
}
