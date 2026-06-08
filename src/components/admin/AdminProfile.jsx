import { useState } from "react";

export default function AdminProfile({ db, saveDB }) {
  const [form, setForm] = useState({ ...db.profile });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveDB({ ...db, profile: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Profil & Branding</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Logo / Emoji</label>
          <input className="w-20 h-14 text-center text-3xl rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Nama Portal</label>
          <input className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Sub-judul</label>
          <input className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-6 text-center border border-indigo-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow text-3xl mb-3">{form.logo}</div>
          <div className="font-bold text-gray-800">{form.name}</div>
          <div className="text-xs text-gray-500 mt-1">{form.subtitle}</div>
        </div>

        <button onClick={handleSave} className={`w-full py-3 rounded-xl text-white font-medium text-sm transition-all ${saved ? "bg-green-500" : "bg-indigo-500 hover:bg-indigo-600"}`}>
          {saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
