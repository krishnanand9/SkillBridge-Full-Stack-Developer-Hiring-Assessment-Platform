import { useQuery } from '@tanstack/react-query'; import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'; import { useRef } from 'react'; import toast from 'react-hot-toast'; import { api, errMsg } from '../api'; import { useMe } from '../App';
const Stat = ({ l, v }: { l: string; v: any }) => <div className="card"><p className="text-sm text-slate-500">{l}</p><p className="text-2xl font-semibold">{v}</p></div>;
export default function Dashboard() {
  const { data: me } = useMe(); const { data: d, isLoading } = useQuery({ queryKey: ['dash'], queryFn: () => api.get('/dashboard').then((r) => r.data) }); const file = useRef<HTMLInputElement>(null);
  if (isLoading || !d) return <p>Loading…</p>;
  const upload = async (f?: File) => { if (!f) return; const fd = new FormData(); fd.append('resume', f); try { await api.post('/candidate/resume', fd); toast.success('Resume uploaded'); } catch (e) { toast.error(errMsg(e)); } };
  const chart = me?.role === 'candidate' ? d.skillScores.map((s: any) => ({ name: s.skill, value: s.score })) : me?.role === 'recruiter' ? d.pipeline.map((s: any) => ({ name: s.stage, value: s.count })) : null;
  const stats: [string, any][] = me?.role === 'candidate' ? [['Profile complete', d.profileCompletion + '%'], ['Applications', d.totalApplications], ['Shortlisted', d.shortlisted], ['Assessments', d.assessmentsCompleted], ['Avg score', d.avgScore + '%']]
    : me?.role === 'recruiter' ? [['Active jobs', d.activeJobs], ['Applicants', d.totalApplicants], ['Shortlisted', d.shortlisted], ['Assessments', d.assessments]] : [['Candidates', d.candidates], ['Recruiters', d.recruiters], ['Active jobs', d.activeJobs], ['Assessments', d.assessments]];
  return <div className="space-y-4"><h1 className="text-xl font-semibold">Welcome, {me?.name}</h1>{me?.status === 'pending' && <p className="card">Your recruiter account is awaiting admin approval.</p>}
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{stats.map(([l, v]) => <Stat key={l} l={l} v={v} />)}</div>
    {me?.role === 'candidate' && <div className="card"><input ref={file} type="file" accept="application/pdf" hidden onChange={(e) => upload(e.target.files?.[0])} /><button className="btn" onClick={() => file.current?.click()}>Upload PDF resume</button></div>}
    {chart && <div className="card h-64">{chart.length ? <ResponsiveContainer><BarChart data={chart}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#4f46e5" /></BarChart></ResponsiveContainer> : <p>No data yet — complete an assessment.</p>}</div>}</div>;
}
