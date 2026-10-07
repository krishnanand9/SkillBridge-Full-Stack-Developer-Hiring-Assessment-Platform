import { useQuery, useQueryClient } from '@tanstack/react-query'; import toast from 'react-hot-toast'; import { api, errMsg } from '../api';
export default function Admin() {
  const qc = useQueryClient(); const { data } = useQuery({ queryKey: ['users'], queryFn: () => api.get('/admin/users', { params: { limit: 50 } }).then((r) => r.data) });
  const set = async (id: string, status: string) => { try { await api.patch(`/admin/users/${id}/status`, { status }); qc.invalidateQueries({ queryKey: ['users'] }); } catch (e) { toast.error(errMsg(e)); } };
  return <div className="space-y-2"><h1 className="text-xl font-semibold">User management</h1>{data?.items.map((u: any) => <div key={u._id} className="card flex items-center justify-between text-sm"><span>{u.name} · {u.email} · {u.role} · <b>{u.status}</b></span>
    {u.role !== 'admin' && <span className="flex gap-2">{u.status !== 'active' && <button className="btn" onClick={() => set(u._id, 'active')}>{u.status === 'pending' ? 'Approve' : 'Restore'}</button>}{u.status !== 'suspended' && <button className="btn bg-red-600" onClick={() => set(u._id, 'suspended')}>Suspend</button>}</span>}</div>)}</div>;
}
