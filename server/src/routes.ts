import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken'; import multer from 'multer'; import path from 'path'; import { z } from 'zod';
import * as M from './models';
const r = Router();
const SECRET = () => process.env.JWT_SECRET as string;
const me = (req: Request) => (req as any).user;
const log = (user: any, action: string, meta = {}) => M.ActivityLog.create({ user, action, meta });
const auth = (...roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const t = req.cookies.token; if (!t) return res.status(401).json({ message: 'Not authenticated' });
    const u = await M.User.findById((jwt.verify(t, SECRET()) as any).id);
    if (!u || u.status === 'suspended') return res.status(401).json({ message: 'Account unavailable' });
    if (roles.length && !roles.includes(u.role)) return res.status(403).json({ message: 'Forbidden' });
    (req as any).user = u; next();
  } catch { res.status(401).json({ message: 'Session expired' }); }
};
const approved = (req: Request, res: Response, next: NextFunction) =>
  me(req).status === 'active' ? next() : res.status(403).json({ message: 'Recruiter account awaiting admin approval' });
const page = (q: any) => { const p = Math.max(1, +q.page || 1), l = Math.min(50, +q.limit || 10); return { p, l, skip: (p - 1) * l }; };

// ---- Auth
const regSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8), role: z.enum(['candidate', 'recruiter']) });
const sign = (res: Response, id: string) => res.cookie('token', jwt.sign({ id }, SECRET(), { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }),
  { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 864e5 });
r.post('/auth/register', async (req, res) => {
  const d = regSchema.parse(req.body);
  if (await M.User.findOne({ email: d.email })) return res.status(409).json({ message: 'Email already registered' });
  const u = await M.User.create({ ...d, password: await bcrypt.hash(d.password, 12), status: d.role === 'recruiter' ? 'pending' : 'active' });
  if (d.role === 'candidate') await M.CandidateProfile.create({ user: u._id }); else await M.RecruiterProfile.create({ user: u._id });
  sign(res, u.id); res.status(201).json({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status });
});
r.post('/auth/login', async (req, res) => {
  const d = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
  const u = await M.User.findOne({ email: d.email }).select('+password');
  if (!u || !(await bcrypt.compare(d.password, u.password))) return res.status(401).json({ message: 'Invalid credentials' });
  if (u.status === 'suspended') return res.status(403).json({ message: 'Account suspended' });
  sign(res, u.id); res.json({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status });
});
r.post('/auth/logout', (_q, res) => { res.clearCookie('token'); res.json({ ok: true }); });
r.get('/auth/me', auth(), (req, res) => { const u = me(req); res.json({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status }); });

// ---- Candidate profile + resume
const upload = multer({ dest: path.join(__dirname, '../uploads'), limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_q, f, cb) => cb(null, f.mimetype === 'application/pdf' && f.originalname.toLowerCase().endsWith('.pdf')) });
r.get('/candidate/profile', auth('candidate'), async (req, res) => res.json(await M.CandidateProfile.findOne({ user: me(req)._id })));
r.put('/candidate/profile', auth('candidate'), async (req, res) => {
  const d = z.object({ headline: z.string().max(120).optional(), skills: z.array(z.string()).max(40).optional(),
    github: z.string().url().optional().or(z.literal('')), linkedin: z.string().url().optional().or(z.literal('')) }).parse(req.body);
  res.json(await M.CandidateProfile.findOneAndUpdate({ user: me(req)._id }, d, { new: true, upsert: true }));
});
r.post('/candidate/resume', auth('candidate'), upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'A PDF file under 2MB is required' });
  res.json(await M.CandidateProfile.findOneAndUpdate({ user: me(req)._id }, { resumePath: req.file.filename }, { new: true }));
});

// ---- Jobs
r.get('/jobs', async (req, res) => {
  const { p, l, skip } = page(req.query); const q = req.query as any; const f: any = { status: 'active' };
  if (q.search) f.$text = { $search: String(q.search) };
  if (q.location) f.location = new RegExp(String(q.location).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (q.type) f.type = String(q.type);
  if (q.maxExperience) f.minExperience = { $lte: +q.maxExperience };
  if (q.minSalary) f.salaryMax = { $gte: +q.minSalary };
  const [items, total] = await Promise.all([M.Job.find(f).sort('-createdAt').skip(skip).limit(l), M.Job.countDocuments(f)]);
  res.json({ items, total, page: p, pages: Math.ceil(total / l) });
});
r.get('/jobs/:id', async (req, res) => { const j = await M.Job.findOne({ _id: req.params.id, status: 'active' }); j ? res.json(j) : res.status(404).json({ message: 'Job not found' }); });
const jobSchema = z.object({ title: z.string().min(3), company: z.string().min(1), location: z.string(), type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  minExperience: z.coerce.number().min(0).default(0), salaryMin: z.coerce.number().optional(), salaryMax: z.coerce.number().optional(), skills: z.array(z.string()), description: z.string().min(10) });
r.get('/recruiter/jobs', auth('recruiter'), async (req, res) => res.json(await M.Job.find({ recruiter: me(req)._id }).sort('-createdAt')));
r.post('/jobs', auth('recruiter'), approved, async (req, res) => { const j = await M.Job.create({ ...jobSchema.parse(req.body), recruiter: me(req)._id }); await log(me(req)._id, 'job.create', { job: j._id }); res.status(201).json(j); });
r.put('/jobs/:id', auth('recruiter'), approved, async (req, res) => {
  const j = await M.Job.findOneAndUpdate({ _id: req.params.id, recruiter: me(req)._id }, jobSchema.partial().parse(req.body), { new: true });
  j ? res.json(j) : res.status(404).json({ message: 'Job not found' });
});
r.delete('/jobs/:id', auth('recruiter'), async (req, res) => {
  const j = await M.Job.findOneAndDelete({ _id: req.params.id, recruiter: me(req)._id });
  if (j) await M.JobApplication.deleteMany({ job: j._id });
  j ? res.json({ ok: true }) : res.status(404).json({ message: 'Job not found' });
});
r.post('/jobs/:id/save', auth('candidate'), async (req, res) => {
  const k = { user: me(req)._id, job: req.params.id }; const ex = await M.SavedJob.findOneAndDelete(k);
  if (!ex) await M.SavedJob.create(k); res.json({ saved: !ex });
});
r.get('/saved-jobs', auth('candidate'), async (req, res) => res.json((await M.SavedJob.find({ user: me(req)._id }).populate('job')).map((s: any) => s.job).filter(Boolean)));

// ---- Applications
r.post('/jobs/:id/apply', auth('candidate'), async (req, res) => {
  const job = await M.Job.findOne({ _id: req.params.id, status: 'active' }); if (!job) return res.status(404).json({ message: 'Job not found' });
  const prof = await M.CandidateProfile.findOne({ user: me(req)._id });
  if (!prof?.resumePath) return res.status(400).json({ message: 'Upload a PDF resume before applying' });
  try { const a = await M.JobApplication.create({ job: job._id, candidate: me(req)._id }); await log(me(req)._id, 'application.create', { job: job._id }); res.status(201).json(a); }
  catch (e: any) { if (e.code === 11000) return res.status(409).json({ message: 'You already applied to this job' }); throw e; }
});
r.get('/applications/mine', auth('candidate'), async (req, res) => res.json(await M.JobApplication.find({ candidate: me(req)._id }).populate('job', 'title company location').sort('-createdAt')));
r.get('/recruiter/applicants', auth('recruiter'), async (req, res) => {
  const ids = (await M.Job.find({ recruiter: me(req)._id }).select('_id')).map((j) => j._id);
  const f: any = { job: { $in: ids } }; if (req.query.stage) f.stage = String(req.query.stage);
  const apps: any[] = await M.JobApplication.find(f).populate('job', 'title').populate('candidate', 'name email').sort('-createdAt').lean();
  const profs = await M.CandidateProfile.find({ user: { $in: apps.map((a) => a.candidate._id) } }).lean();
  res.json(apps.map((a) => ({ ...a, profile: profs.find((p) => String(p.user) === String(a.candidate._id)) })));
});
r.patch('/applications/:id/stage', auth('recruiter'), async (req, res) => {
  const { stage } = z.object({ stage: z.enum(M.STAGES) }).parse(req.body);
  const a: any = await M.JobApplication.findById(req.params.id).populate('job');
  if (!a || String(a.job.recruiter) !== String(me(req)._id)) return res.status(404).json({ message: 'Application not found' });
  a.stage = stage; await a.save(); res.json(a);
});

// ---- Assessments
const asmSchema = z.object({ title: z.string().min(3), skill: z.enum(['React', 'JavaScript', 'Node.js', 'TypeScript', 'MongoDB', 'DSA']),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']), durationMinutes: z.coerce.number().min(1).max(180), passingScore: z.coerce.number().min(1).max(100),
  questions: z.array(z.object({ text: z.string().min(3), options: z.array(z.string().min(1)).min(2).max(6), correctIndex: z.number().int().min(0) })).min(1) });
r.post('/assessments', auth('recruiter'), approved, async (req, res) => {
  const { questions, ...d } = asmSchema.parse(req.body);
  if (questions.some((q) => q.correctIndex >= q.options.length)) return res.status(400).json({ message: 'correctIndex out of range' });
  const a = await M.Assessment.create({ ...d, recruiter: me(req)._id });
  await M.Question.insertMany(questions.map((q) => ({ ...q, assessment: a._id }))); res.status(201).json(a);
});
r.get('/assessments', auth(), async (req, res) => {
  const f: any = { status: 'active' }; if (me(req).role === 'recruiter') f.recruiter = me(req)._id; if (req.query.skill) f.skill = String(req.query.skill);
  res.json(await M.Assessment.find(f).sort('-createdAt'));
});
r.delete('/assessments/:id', auth('recruiter'), async (req, res) => {
  const a = await M.Assessment.findOneAndUpdate({ _id: req.params.id, recruiter: me(req)._id }, { status: 'removed' }); a ? res.json({ ok: true }) : res.status(404).json({ message: 'Not found' });
});
r.post('/assessments/:id/start', auth('candidate'), async (req, res) => {
  const a = await M.Assessment.findOne({ _id: req.params.id, status: 'active' }); if (!a) return res.status(404).json({ message: 'Assessment not found' });
  const qs = (await M.Question.find({ assessment: a._id }).lean()).sort(() => Math.random() - 0.5);
  const at = await M.AssessmentAttempt.create({ assessment: a._id, candidate: me(req)._id, startedAt: new Date() });
  res.json({ attemptId: at.id, durationMinutes: a.durationMinutes, questions: qs.map((q) => ({ _id: q._id, text: q.text, options: q.options })) });
});
r.post('/attempts/:id/submit', auth('candidate'), async (req, res) => {
  const { answers } = z.object({ answers: z.record(z.number().int()) }).parse(req.body);
  const at: any = await M.AssessmentAttempt.findOne({ _id: req.params.id, candidate: me(req)._id });
  if (!at) return res.status(404).json({ message: 'Attempt not found' }); if (at.submittedAt) return res.status(409).json({ message: 'Already submitted' });
  const a: any = await M.Assessment.findById(at.assessment);
  const qs = await M.Question.find({ assessment: a._id }).select('+correctIndex');
  const now = new Date(); const limit = a.durationMinutes * 60 + 10; // 10s grace for network latency
  const late = (now.getTime() - at.startedAt.getTime()) / 1000 > limit;
  const correct = late ? 0 : qs.filter((q: any) => answers[String(q._id)] === q.correctIndex).length;
  const accuracy = Math.round((correct / qs.length) * 100);
  Object.assign(at, { answers, submittedAt: now, score: accuracy, accuracy, passed: accuracy >= a.passingScore,
    timeTakenSec: Math.min(Math.round((now.getTime() - at.startedAt.getTime()) / 1000), a.durationMinutes * 60) });
  await at.save(); await log(me(req)._id, 'assessment.submit', { assessment: a._id, score: accuracy }); res.json(at);
});
r.get('/attempts/mine', auth('candidate'), async (req, res) => res.json(await M.AssessmentAttempt.find({ candidate: me(req)._id, submittedAt: { $exists: true } }).populate('assessment', 'title skill difficulty passingScore').sort('-submittedAt')));
r.get('/recruiter/attempts', auth('recruiter'), async (req, res) => {
  const ids = (await M.Assessment.find({ recruiter: me(req)._id }).select('_id')).map((x) => x._id);
  res.json(await M.AssessmentAttempt.find({ assessment: { $in: ids }, submittedAt: { $exists: true } }).populate('assessment', 'title skill').populate('candidate', 'name email').select('-answers').sort('-submittedAt'));
});

// ---- Dashboards (all values computed from DB)
r.get('/dashboard', auth(), async (req, res) => {
  const u = me(req);
  if (u.role === 'candidate') {
    const [apps, attempts, prof] = await Promise.all([M.JobApplication.find({ candidate: u._id }), M.AssessmentAttempt.find({ candidate: u._id, submittedAt: { $exists: true } }).populate('assessment', 'skill title'), M.CandidateProfile.findOne({ user: u._id })]);
    const checks = [prof?.headline, prof?.skills?.length, prof?.resumePath, prof?.github, prof?.linkedin];
    const bySkill: Record<string, number[]> = {}; attempts.forEach((a: any) => (bySkill[a.assessment.skill] ||= []).push(a.score));
    return res.json({ totalApplications: apps.length, shortlisted: apps.filter((a) => a.stage === 'Shortlisted').length, assessmentsCompleted: attempts.length,
      avgScore: attempts.length ? Math.round(attempts.reduce((s, a: any) => s + a.score, 0) / attempts.length) : 0,
      profileCompletion: Math.round((checks.filter(Boolean).length / checks.length) * 100),
      skillScores: Object.entries(bySkill).map(([skill, v]) => ({ skill, score: Math.round(v.reduce((a, b) => a + b, 0) / v.length) })),
      recentActivity: await M.ActivityLog.find({ user: u._id }).sort('-createdAt').limit(8) });
  }
  if (u.role === 'recruiter') {
    const jobs = await M.Job.find({ recruiter: u._id }); const apps = await M.JobApplication.find({ job: { $in: jobs.map((j) => j._id) } });
    return res.json({ activeJobs: jobs.filter((j) => j.status === 'active').length, totalApplicants: apps.length, shortlisted: apps.filter((a) => a.stage === 'Shortlisted').length,
      assessments: await M.Assessment.countDocuments({ recruiter: u._id, status: 'active' }), pipeline: M.STAGES.map((s) => ({ stage: s, count: apps.filter((a) => a.stage === s).length })) });
  }
  const [candidates, recruiters, activeJobs, assessments] = await Promise.all([M.User.countDocuments({ role: 'candidate' }), M.User.countDocuments({ role: 'recruiter' }), M.Job.countDocuments({ status: 'active' }), M.Assessment.countDocuments({ status: 'active' })]);
  res.json({ candidates, recruiters, activeJobs, assessments, recentActivity: await M.ActivityLog.find().sort('-createdAt').limit(10) });
});

// ---- Admin
r.get('/admin/users', auth('admin'), async (req, res) => { const { p, l, skip } = page(req.query); const f: any = req.query.role ? { role: String(req.query.role) } : {};
  res.json({ items: await M.User.find(f).sort('-createdAt').skip(skip).limit(l), total: await M.User.countDocuments(f), page: p }); });
r.patch('/admin/users/:id/status', auth('admin'), async (req, res) => {
  const { status } = z.object({ status: z.enum(['active', 'suspended']) }).parse(req.body);
  if (req.params.id === me(req).id) return res.status(400).json({ message: 'Cannot change your own status' });
  const u = await M.User.findByIdAndUpdate(req.params.id, { status }, { new: true }); if (u) await log(me(req)._id, 'admin.user.status', { target: u._id, status });
  u ? res.json(u) : res.status(404).json({ message: 'User not found' });
});
r.get('/admin/jobs', auth('admin'), async (_q, res) => res.json(await M.Job.find().sort('-createdAt').limit(100)));
r.patch('/admin/jobs/:id', auth('admin'), async (req, res) => { const { status } = z.object({ status: z.enum(['active', 'closed', 'removed']) }).parse(req.body); res.json(await M.Job.findByIdAndUpdate(req.params.id, { status }, { new: true })); });
export default r;
