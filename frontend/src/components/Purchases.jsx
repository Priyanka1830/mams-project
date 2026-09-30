import React, { useState } from 'react';

export default function Purchases({ token, user }) {
  const [baseId, setBaseId] = useState(user.base_id || '1');
  const [equipmentId, setEquipmentId] = useState('1');
  const [quantity, setQuantity] = useState('');
  const [vendor, setVendor] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/v1/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          base_id: parseInt(baseId, 10),
          equipment_id: parseInt(equipmentId, 10),
          quantity: parseInt(quantity, 10),
          vendor
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Purchase successfully recorded and balance updated!');
        setQuantity('');
        setVendor('');
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Failed to record purchase');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
      <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-3">Record New Asset Purchase</h2>

      {message && <div className="p-3 bg-slate-800 text-sm rounded border border-slate-700">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Select Military Installation</label>
          <select
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
            disabled={user.role !== 'ADMIN'}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
          >
            <option value="1">Fort Alpha</option>
            <option value="2">Camp Bravo</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Equipment Type</label>
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
          <label className="block text-xs font-medium text-slate-400 mb-1">Quantity Purchased</label>
          <input
            type="number"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
            placeholder="e.g. 100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Vendor / Supplier</label>
          <input
            type="text"
            required
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200"
            placeholder="e.g. Defense Armaments Corp"
          />
        </div>

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition">
          Log Purchase Transaction
        </button>
      </form>
    </div>
  );
}