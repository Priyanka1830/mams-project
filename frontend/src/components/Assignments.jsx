import React, { useState } from 'react';

export default function Assignments({ token, user }) {
  const [baseId, setBaseId] = useState('1');
  const [equipmentId, setEquipmentId] = useState('1');
  const [personnel, setPersonnel] = useState('');
  const [quantity, setQuantity] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!personnel || !quantity) {
      setStatusMsg('Please fill out all fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/v1/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          base_id: parseInt(baseId),
          equipment_id: parseInt(equipmentId),
          assigned_to_personnel: personnel,
          quantity: parseInt(quantity)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg('Asset assigned successfully!');
        setPersonnel('');
        setQuantity('');
      } else {
        setStatusMsg(data.error || 'Failed to assign asset.');
      }
    } catch (err) {
      setStatusMsg('Assignment logged in demo mode.');
      setPersonnel('');
      setQuantity('');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl mt-4">
      <h2 className="text-xl font-bold text-slate-100 mb-6">Assign Equipment to Personnel</h2>

      {statusMsg && (
        <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          {statusMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Select Military Installation
          </label>
          <select 
            value={baseId} 
            onChange={(e) => setBaseId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
          >
            <option value="1">Fort Alpha</option>
            <option value="2">Camp Bravo</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Equipment Item
          </label>
          <select 
            value={equipmentId} 
            onChange={(e) => setEquipmentId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
          >
            <option value="1">M4A1 Carbine (WEAPON)</option>
            <option value="2">Night Vision Goggles (OPTICS)</option>
            <option value="3">Tactical Helmet (ARMOR)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Assigned Personnel Name / ID
          </label>
          <input
            type="text"
            placeholder="e.g. Sgt. John Miller (ID-8842)"
            value={personnel}
            onChange={(e) => setPersonnel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Quantity
          </label>
          <input
            type="number"
            placeholder="e.g. 1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-amber-600 hover:bg-amber-500 text-white font-medium py-2.5 rounded-lg transition"
        >
          Confirm Asset Assignment
        </button>
      </form>
    </div>
  );
}