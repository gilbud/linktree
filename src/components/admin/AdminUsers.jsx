import { useState } from "react";
import Icon from "../ui/Icon";

export default function AdminUsers({ db, saveDB }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyUser = { name: "", username: "", password: "", role: "publik", avatar: "" };
  const [form, setForm] = useState(emptyUser);

  const openNew = () => { setForm(emptyUser); setEditing(null); setShowForm(true); };
  const openEdit = (u) => { setForm({ ...u }); setEditing(u.id); setShowForm(true); };

  const saveForm = () => {
    const newDB = { ...db };
    if (editing) {
      newDB.users = db.users.map(u => u.id === editing ? { ...form, id: u.id } : u);
    } else {
      newDB.users = [...db.users, { ...form, id: Date.now(), avatar: form.name.slice(0, 2).toUpperCase() }];
    }
    saveDB(newDB);
    setShowForm(false);
  };

  const deleteUser = (id) => {
    if (!confirm("Hapus pengguna ini?")) return;
    saveDB({ ...db, users: db.users.filter(u => u.id !== id) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Kelola Pengguna</h2>
        <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors shadow-sm">
          <Icon name="plus" size={15} /> Tambah User
        </button>
      </div>

      <div className="space-y-2">
        {db.users.map(u => {
          const role = db.roles.find(r => r.id === u.role);
          return (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-2xl text-white font-bold text-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: role?.color }}>
                {u.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm">{u.name}</div>
                <div className="text-xs text-gray-400">@{u.username}</div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: role?.color }}>{role?.label}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500"><Icon name="edit" size={14} /></button>
                <button onClick={() => deleteUser(u.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Icon name="trash" size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">{editing ? "Edit" : "Tambah"} Pengguna</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100"><Icon name="x" size={16} /></button>
            </div>
            <div className="space-y-3">
              {[["name", "Nama Lengkap", "text"], ["username", "Username", "text"], ["password", "Password", "password"]].map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                  <input type={type} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Role</label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  {db.roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">Batal</button>
              <button onClick={saveForm} className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
