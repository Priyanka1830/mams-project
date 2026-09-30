import React, { useState } from 'react';

export default function Transfers({ token, user }) {
  const [fromBase, setFromBase] = useState(user.base_id || '1');
  const [toBase, setToBase] = useState('2');
  const [equipmentId, setEquipmentId] = useState('1');
  const [quantity, setQuantity] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (fromBase === toBase) {
      setStatusMsg('❌ Source and destination base cannot be identical.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/v1/transfers/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          from_base_id: parseInt(fromBase, 10),
          to_base_id: parseInt(toBase, 10),
          equipment_id: parseInt(equipmentId, 10),
          quantity: parseInt(quantity, 10)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg('✅ Inter-base asset transfer initiated successfully!');
        setQuantity('');
      } else {
        setStatusMsg(`❌ ${data.error}`);
      }
    } catch (err) {
      setStatusMsg('❌ Failed to process transfer request.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
      <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-3">Initiate Asset Transfer</h2>

      {statusMsg && <div className="p-3 bg-slate-800 text-sm rounded border border-slate-700">{statusMsg}</div>}

      <form onSubmit={handleTransfer} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Source Base (From)</label>
            <select
              value={fromBase}
              onChange={(e) => setFromBase(e.target.value)}
              disabled={user.role !== 'ADMIN'}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
            >
              <option value="1">Fort Alpha</option>
              <option value="2">Camp Bravo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Destination Base (To)</label>
            <select
              value={toBase}
              onChange={(e) => setToBase(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
            >
              <option value="1">Fort Alpha</option>
              <option value="2">Camp Bravo</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Equipment Item</label>
          <select
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
          >
            <option value="1">M4A1 Carbine (WEAPON)</option>
            <option value="2">5.56mm NATO Ammo Box (AMMUNITION)</option>
            <option value="3">JLTV Armored Vehicle (VEHICLE)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Transfer Quantity</label>
          <input
            type="number"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
            placeholder="e.g. 25"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition">
          Dispatch Transfer Request
        </button>
      </form>
    </div>
  );
}