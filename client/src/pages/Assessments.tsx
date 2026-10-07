import { useEffect, useRef, useState } from 'react'; import { Link, useNavigate, useParams } from 'react-router-dom'; import { useQuery, useQueryClient } from '@tanstack/react-query'; import toast from 'react-hot-toast'; import { api, errMsg } from '../api'; import { useMe } from '../App';
export default function Assessments() {
  const { data: me } = useMe(); const qc = useQueryClient(); const [f, setF] = useState({ title: '', skill: 'React', difficulty: 'Beginner', durationMinutes: 10, passingScore: 60, q: '', o: '', c: 0 });
  const list = useQuery({ queryKey: ['asm'], queryFn: () => api.get('/assessments').then((r) => r.data) });
  const hist = useQuery({ queryKey: ['hist'], enabled: me?.role === 'candidate', queryFn: () => api.get('/attempts/mine').then((r) => r.data) });
  const create = async (e: React.FormEvent) => { e.preventDefault(); const options = f.o.split('|').map((s) => s.trim()).filter(Boolean);
    try { await api.post('/assessments', { title: f.title, skill: f.skill, difficulty: f.difficulty, durationMinutes: f.durationMinutes, passingScore: f.passingScore, questions: [{ text: f.q, options, correctIndex: f.c }] }); toast.success('Created'); qc.invalidateQueries({ queryKey: ['asm'] }); } catch (x) { toast.error(errMsg(x)); } };
  return <div className="space-y-4"><h1 className="text-xl font-semibold">Assessments</h1>
    {me?.role === 'recruiter' && <form onSubmit={create} className="card grid gap-2 md:grid-cols-2"><input className="input" placeholder="Title" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      <select className="input" value={f.skill} onChange={(e) => setF({ ...f, skill: e.target.value })}>{['React', 'JavaScript', 'Node.js', 'TypeScript', 'MongoDB', 'DSA'].map((s) => <option key={s}>{s}</option>)}</select>
      <input className="input" placeholder="Question" required value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} /><input className="input" placeholder="Options separated by |" required value={f.o} onChange={(e) => setF({ ...f, o: e.target.value })} />
      <input className="input" type="number" min={0} placeholder="Correct option index (0-based)" value={f.c} onChange={(e) => setF({ ...f, c: +e.target.value })} /><button className="btn">Create assessment</button></form>}
    {list.data?.map((a: any) => <div key={a._id} className="card flex items-center justify-between"><div><b>{a.title}</b><p className="text-sm text-slate-500">{a.skill} · {a.difficulty} · {a.durationMinutes} min · pass {a.passingScore}%</p></div>{me?.role === 'candidate' && <Link className="btn" to={`/assessments/${a._id}/take`}>Start</Link>}</div>)}
    {me?.role === 'candidate' && <><h2 className="font-semibold">History</h2>{hist.data?.length ? hist.data.map((h: any) => <div key={h._id} className="card text-sm">{h.assessment?.title}: {h.score}% {h.passed ? '✓ passed' : '✗ not passed'} · {h.timeTakenSec}s</div>) : <p className="card">No attempts yet.</p>}</>}</div>;
}
export function TakeAssessment() {
  const { id } = useParams(); const nav = useNavigate(); const [s, setS] = useState<any>(null); const [ans, setAns] = useState<Record<string, number>>({}); const [left, setLeft] = useState(0); const done = useRef(false); const ansRef = useRef(ans); ansRef.current = ans;
  useEffect(() => { api.post(`/assessments/${id}/start`).then((r) => { setS(r.data); setLeft(r.data.durationMinutes * 60); }).catch((e) => { toast.error(errMsg(e)); nav('/assessments'); }); }, [id]);
  const submit = async () => { if (done.current || !s) return; done.current = true; try { const { data } = await api.post(`/attempts/${s.attemptId}/submit`, { answers: ansRef.current }); toast.success(`Score ${data.score}% — ${data.passed ? 'passed' : 'not passed'}`); } catch (e) { toast.error(errMsg(e)); } nav('/assessments'); };
  useEffect(() => { if (!s) return; if (left <= 0) { submit(); return; } const t = setTimeout(() => setLeft((l) => l - 1), 1000); return () => clearTimeout(t); }, [s, left]);
  if (!s) return <p>Loading…</p>;
  return <div className="space-y-4"><p className="sticky top-0 bg-white p-2 font-mono dark:bg-slate-900">Time left: {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</p>
    {s.questions.map((q: any, i: number) => <fieldset key={q._id} className="card"><legend className="font-medium">{i + 1}. {q.text}</legend>{q.options.map((o: string, k: number) => <label key={k} className="block text-sm"><input type="radio" name={q._id} checked={ans[q._id] === k} onChange={() => setAns({ ...ans, [q._id]: k })} /> {o}</label>)}</fieldset>)}
    <button className="btn" onClick={submit}>Submit</button></div>;
}
