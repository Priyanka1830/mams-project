import React, { useState, useEffect } from 'react';

export default function Dashboard({ token, user }) {
  const [metrics, setMetrics] = useState(null);
  const [selectedBase, setSelectedBase] = useState(user.role === 'ADMIN' ? '' : user.base_id);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, [selectedBase]);

  const fetchMetrics = async () => {
    try {
      const url = `http://localhost:5000/api/v1/dashboard/metrics${selectedBase ? `?base_id=${selectedBase}` : ''}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!metrics) return <div className="text-slate-400">Loading operational balances...</div>;

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-800">
        <h2 className="text-lg font-semibold text-slate-200">System Overview</h2>
        {user.role === 'ADMIN' && (
          <select
            value={selectedBase}
            onChange={(e) => setSelectedBase(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
          >
            <option value="">All Bases (Global View)</option>
            <option value="1">Fort Alpha</option>
            <option value="2">Camp Bravo</option>
          </select>
        )}
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 p-5 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Opening Balance</p>
          <p className="text-2xl font-bold text-slate-100 mt-2">{metrics.opening_balance}</p>
        </div>

        {/* CLICKABLE NET MOVEMENT CARD (Bonus Pop-up Trigger) */}
        <div
          onClick={() => setShowModal(true)}
          className="bg-emerald-950/30 p-5 rounded-lg border border-emerald-500/30 hover:border-emerald-500 cursor-pointer transition shadow-lg"
        >
          <div className="flex justify-between items-start">
            <p className="text-xs text-emerald-400 font-medium">Net Movement 🔍</p>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Click details</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {metrics.net_movement >= 0 ? `+${metrics.net_movement}` : metrics.net_movement}
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Closing Balance</p>
          <p className="text-2xl font-bold text-slate-100 mt-2">{metrics.closing_balance}</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Assigned Assets</p>
          <p className="text-2xl font-bold text-amber-400 mt-2">{metrics.assigned}</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Expended Assets</p>
          <p className="text-2xl font-bold text-rose-400 mt-2">{metrics.expended}</p>
        </div>
      </div>

      {/* NET MOVEMENT POP-UP MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-emerald-400">Net Movement Breakdown</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-300">Purchases (+)</span>
                <span className="font-mono text-emerald-400 font-bold">+{metrics.purchases}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-300">Transfers In (+)</span>
                <span className="font-mono text-blue-400 font-bold">+{metrics.transfers_in}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-300">Transfers Out (-)</span>
                <span className="font-mono text-rose-400 font-bold">-{metrics.transfers_out}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center font-bold">
                <span className="text-slate-200">Total Calculated Movement</span>
                <span className="text-emerald-400 font-mono text-lg">{metrics.net_movement}</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg transition text-sm font-medium"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}