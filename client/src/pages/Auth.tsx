import { useState } from 'react'; import { useNavigate, Link } from 'react-router-dom'; import { useQueryClient } from '@tanstack/react-query'; import toast from 'react-hot-toast'; import { api, errMsg } from '../api';
function AuthForm({ register }: { register?: boolean }) {
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'candidate' }); const nav = useNavigate(); const qc = useQueryClient();
  const submit = async (e: React.FormEvent) => { e.preventDefault();
    try { const { data } = await api.post(register ? '/auth/register' : '/auth/login', f); qc.setQueryData(['me'], data); nav('/dashboard'); } catch (x) { toast.error(errMsg(x)); } };
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  return <form onSubmit={submit} className="card mx-auto mt-10 max-w-sm space-y-3"><h1 className="text-xl font-semibold">{register ? 'Create account' : 'Log in'}</h1>
    {register && <input className="input" placeholder="Name" required minLength={2} value={f.name} onChange={set('name')} />}
    <input className="input" type="email" placeholder="Email" required value={f.email} onChange={set('email')} />
    <input className="input" type="password" placeholder="Password (min 8)" required minLength={8} value={f.password} onChange={set('password')} />
    {register && <select className="input" value={f.role} onChange={set('role')}><option value="candidate">Candidate</option><option value="recruiter">Recruiter</option></select>}
    <button className="btn w-full">{register ? 'Register' : 'Login'}</button>
    <p className="text-sm">{register ? <Link to="/login">Have an account? Log in</Link> : <Link to="/register">Need an account? Register</Link>}</p></form>;
}
export const Login = () => <AuthForm />; export const Register = () => <AuthForm register />;
