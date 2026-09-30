import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Purchases from './components/Purchases';
import Transfers from './components/Transfers';
import Assignments from './components/Assignments';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [token, setToken] = useState(localStorage.getItem('mams_token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('mams_user') || '{}'));

  // Quick Login simulation for testing
  const handleLogin = async (username) => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('mams_token', data.token);
        localStorage.setItem('mams_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      }
    } catch (err) {
      alert('Login failed. Ensure backend server is running on port 5000.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUser({});
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
          <h1 className="text-2xl font-bold text-center text-emerald-400 mb-2">MAMS Terminal Login</h1>
          <p className="text-slate-400 text-sm text-center mb-6">Select a demo role to access the system</p>
          <div className="space-y-3">
            <button onClick={() => handleLogin('admin.supreme')} className="w-full bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-lg font-medium transition">
              Login as Admin (Global Access)
            </button>
            <button onClick={() => handleLogin('cmd.alpha')} className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg font-medium transition">
              Login as Base Commander (Fort Alpha)
            </button>
            <button onClick={() => handleLogin('log.alpha')} className="w-full bg-slate-700 hover:bg-slate-600 py-2.5 rounded-lg font-medium transition">
              Login as Logistics Officer (Fort Alpha)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded border border-emerald-500/30 font-mono">MIL-SYS</span>
          <h1 className="text-xl font-bold tracking-wide">Military Asset Management System</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-200">{user.username}</p>
            <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded uppercase font-mono">{user.role}</span>
          </div>
          <button onClick={handleLogout} className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-sm px-3 py-1.5 rounded transition border border-rose-500/20">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Tabs */}
      <nav className="bg-slate-900/50 border-b border-slate-800 px-6">
        <div className="flex space-x-6">
          {['dashboard', 'purchases', 'transfers', 'assignments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium capitalize border-b-2 transition ${
                activeTab === tab ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'dashboard' && <Dashboard token={token} user={user} />}
        {activeTab === 'purchases' && <Purchases token={token} user={user} />}
        {activeTab === 'transfers' && <Transfers token={token} user={user} />}
        {activeTab === 'assignments' && <Assignments token={token} user={user} />}
      </main>
    </div>
  );
}