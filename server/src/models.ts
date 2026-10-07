import { Schema, model, Types } from 'mongoose';
const ref = (r: string, extra = {}) => ({ type: Schema.Types.ObjectId, ref: r, ...extra });
const opts = { timestamps: true };
export const User = model('User', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['candidate', 'recruiter', 'admin'], default: 'candidate' },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' },
}, opts));
export const CandidateProfile = model('CandidateProfile', new Schema({
  user: ref('User', { unique: true }), headline: String, skills: [String],
  experience: [{ company: String, role: String, years: Number }],
  education: [{ school: String, degree: String, year: Number }],
  projects: [{ name: String, url: String, description: String }],
  github: String, linkedin: String, resumePath: String,
}, opts));
export const RecruiterProfile = model('RecruiterProfile', new Schema({ user: ref('User', { unique: true }), title: String }, opts));
export const Company = model('Company', new Schema({ owner: ref('User', { unique: true }), name: String, website: String, description: String }, opts));
export const Job = model('Job', new Schema({
  recruiter: ref('User', { index: true }), title: { type: String, required: true }, company: String, location: String,
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time' },
  minExperience: { type: Number, default: 0 }, salaryMin: Number, salaryMax: Number,
  skills: [String], description: String, status: { type: String, enum: ['active', 'closed', 'removed'], default: 'active' },
}, opts).index({ title: 'text', description: 'text' }));
export const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'] as const;
export const JobApplication = model('JobApplication', new Schema({
  job: ref('Job'), candidate: ref('User'), stage: { type: String, enum: STAGES, default: 'Applied' },
}, opts).index({ job: 1, candidate: 1 }, { unique: true }));
export const Assessment = model('Assessment', new Schema({
  recruiter: ref('User', { index: true }), title: String,
  skill: { type: String, enum: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'MongoDB', 'DSA'] },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  durationMinutes: { type: Number, default: 15 }, passingScore: { type: Number, default: 60 },
  status: { type: String, enum: ['active', 'removed'], default: 'active' },
}, opts));
export const Question = model('Question', new Schema({
  assessment: ref('Assessment', { index: true }), text: String, options: [String],
  correctIndex: { type: Number, select: false },
}, opts));
export const AssessmentAttempt = model('AssessmentAttempt', new Schema({
  assessment: ref('Assessment'), candidate: ref('User', { index: true }), startedAt: Date, submittedAt: Date,
  answers: { type: Map, of: Number }, score: Number, accuracy: Number, timeTakenSec: Number, passed: Boolean,
}, opts));
export const SavedJob = model('SavedJob', new Schema({ user: ref('User'), job: ref('Job') }, opts).index({ user: 1, job: 1 }, { unique: true }));
export const ActivityLog = model('ActivityLog', new Schema({ user: ref('User'), action: String, meta: Object }, opts));
export type Id = Types.ObjectId;
