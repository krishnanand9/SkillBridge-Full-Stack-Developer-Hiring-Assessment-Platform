import { useState } from 'react'; import { useQuery, useMutation } from '@tanstack/react-query'; 
import toast from 'react-hot-toast'; import { api, errMsg } from '../api'; import { useMe } from '../App';
export default function Jobs() {
  const [search, setSearch] = useState(''); const [type, setType] = useState(''); const [page, setPage] = useState(1); const { data: me } = useMe();
  const { data, isLoading } = useQuery({ queryKey: ['jobs', search, type, page], queryFn: () => api.get('/jobs', { params: { search, type, page } }).then((r) => r.data) });
  const apply = useMutation({ mutationFn: (id: string) => api.post(`/jobs/${id}/apply`), onSuccess: () => toast.success('Applied'), onError: (e) => toast.error(errMsg(e)) });
  const save = useMutation({ mutationFn: (id: string) => api.post(`/jobs/${id}/save`), onSuccess: (r) => toast.success(r.data.saved ? 'Saved' : 'Removed'), onError: (e) => toast.error(errMsg(e)) });
  return <div className="space-y-4"><div className="flex gap-2"><input className="input" placeholder="Search jobs" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
    <select className="input max-w-40" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}><option value="">All types</option>{['full-time', 'part-time', 'contract', 'internship'].map((t) => <option key={t}>{t}</option>)}</select></div>
    {isLoading ? <p>Loading…</p> : !data?.items.length ? <p className="card">No jobs found.</p> : data.items.map((j: any) => <div key={j._id} className="card"><h2 className="font-semibold">{j.title}</h2>
      <p className="text-sm text-slate-500">{j.company} · {j.location} · {j.type}</p><p className="my-2 text-sm">{j.description}</p><p className="text-xs">{j.skills.join(', ')}</p>
      {me?.role === 'candidate' && <div className="mt-2 flex gap-2"><button className="btn" onClick={() => apply.mutate(j._id)}>Apply</button><button className="btn bg-slate-600" onClick={() => save.mutate(j._id)}>Save</button></div>}</div>)}
    <div className="flex items-center gap-2"><button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button><span className="text-sm">Page {page} / {data?.pages || 1}</span><button className="btn" disabled={page >= (data?.pages || 1)} onClick={() => setPage(page + 1)}>Next</button></div></div>;
}
