import React, { useState } from 'react';
import { X, Sparkles, LogIn, UserPlus, Lock, Mail, User, Building2, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { login, signup, quickDemoLogin } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science & Engineering',
    role: 'Frontend Lead'
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (tab === 'login') {
        if (!formData.email) {
          setError('Please enter your email address');
          return;
        }
        await login(formData.email, formData.password);
        if (onAuthSuccess) onAuthSuccess('Logged in successfully!');
        onClose();
      } else {
        if (!formData.name || !formData.email) {
          setError('Please enter your name and email');
          return;
        }
        await signup(formData);
        if (onAuthSuccess) onAuthSuccess(`Welcome to PartnerUp, ${formData.name}!`);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleQuickDemo = async () => {
    setError('');
    try {
      await quickDemoLogin();
      if (onAuthSuccess) onAuthSuccess('Logged in as Anwesha K. (CR / Frontend Lead)');
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-2xl shadow-indigo-500/10 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {tab === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {tab === 'login' ? 'Sign in to access your squad & profile' : 'Join the student hackathon network'}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close authentication modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Quick Demo Login Button */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-slate-950 p-4 rounded-2xl border border-indigo-500/30 space-y-2.5 shadow-lg shadow-indigo-500/5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Instant Test Access</span>
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
              Recommended
            </span>
          </div>
          <button
            type="button"
            aria-label="Sign in instantly as demo user Anwesha K."
            onClick={handleQuickDemo}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <span>Quick Demo Login (Anwesha K. - CR / Lead)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'login'}
            aria-label="Switch to Login form"
            onClick={() => { setTab('login'); setError(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'login'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'signup'}
            aria-label="Switch to Sign Up form"
            onClick={() => { setTab('signup'); setError(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'signup'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  aria-label="Full Name"
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                aria-label="Email Address"
                placeholder="name@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                aria-label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-indigo-400" />
                <span>Department / Major</span>
              </label>
              <select
                aria-label="Department or Major"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Computer Science & Engineering (CSE)">Computer Science & Engineering (CSE)</option>
                <option value="Information Technology (IT)">Information Technology (IT)</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                <option value="HCI & Digital Media">HCI & Digital Media</option>
                <option value="Mechanical / Robotics">Mechanical / Robotics</option>
              </select>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              aria-label={tab === 'login' ? 'Sign In to Account' : 'Create Student Account'}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {tab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{tab === 'login' ? 'Sign In to Account' : 'Create Student Account'}</span>
            </button>
          </div>
        </form>

        <p className="text-[10px] text-center text-slate-500">
          By signing in, you agree to the ProjectMatch Code of Conduct & Academic Integrity policy.
        </p>
      </div>
    </div>
  );
}
