import { useState } from "react";
import Icon from "../ui/Icon";

const emptyLink = (order) => ({
  title: "",
  icon: "🔗",
  description: "",
  type: "link",
  url: "",
  color: "#3b82f6",
  roles: ["admin"],
  order,
});

export default function LinkFormModal({ db, editing, initialData, onSave, onClose }) {
  const [form, setForm] = useState(initialData || emptyLink(db.menus.length + 1));
  const [error, setError] = useState("");

  const toggleRole = (role) => {
    const roles = form.roles || [];
    setForm(f => ({
      ...f,
      roles: roles.includes(role) ? roles.filter(r => r !== role) : [...roles, role],
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    if (!form.url.trim()) {
      setError("URL wajib diisi.");
      return;
    }
    if (!(form.roles || []).length) {
      setError("Pilih minimal satu role.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800">{editing ? "Edit Link" : "Tambah Link Baru"}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Icon</label>
              <input
                className="w-14 h-10 text-center rounded-xl border border-gray-200 text-xl"
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Warna</label>
              <input
                type="color"
                className="w-full h-10 rounded-xl border border-gray-200 cursor-pointer p-1"
                value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Judul *</label>
            <input
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Nama link"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Deskripsi</label>
            <input
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Deskripsi singkat"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">URL *</label>
            <input
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Akses Role</label>
            <div className="flex flex-wrap gap-2">
              {db.roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => toggleRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${(form.roles || []).includes(r.id) ? "text-white" : "text-gray-500 border-gray-200 bg-white hover:bg-gray-50"}`}
                  style={(form.roles || []).includes(r.id) ? { backgroundColor: r.color, borderColor: r.color } : {}}
                >
                  {(form.roles || []).includes(r.id) && <Icon name="check" size={10} />}
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
            Batal
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
