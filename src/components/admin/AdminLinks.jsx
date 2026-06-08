import { useState } from "react";
import Icon from "../ui/Icon";
import LinkFormModal from "./LinkFormModal";

export default function AdminLinks({ db, saveDB }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(null);

  const linkMenus = [...db.menus]
    .filter(m => m.type === "link")
    .sort((a, b) => a.order - b.order);

  const openNew = () => {
    setFormData({
      title: "",
      icon: "🔗",
      description: "",
      type: "link",
      url: "",
      color: "#3b82f6",
      roles: ["admin", "keuangan", "operasional", "publik"],
      order: db.menus.length + 1,
    });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (menu) => {
    setFormData({ ...menu });
    setEditing(menu.id);
    setShowForm(true);
  };

  const handleSave = (form) => {
    const newDB = { ...db, menus: [...db.menus] };
    if (editing) {
      newDB.menus = newDB.menus.map(m =>
        m.id === editing ? { ...m, ...form, type: "link", submenus: m.submenus || [] } : m
      );
    } else {
      newDB.menus.push({ ...form, id: Date.now(), type: "link", submenus: [] });
    }
    saveDB(newDB);
    setShowForm(false);
  };

  const deleteLink = (id) => {
    if (!confirm("Hapus link ini?")) return;
    saveDB({ ...db, menus: db.menus.filter(m => m.id !== id) });
  };

  const moveLink = (id, dir) => {
    const sorted = [...linkMenus];
    const idx = sorted.findIndex(m => m.id === id);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === sorted.length - 1)) return;
    const other = sorted[idx + dir];
    const updated = db.menus.map(m => {
      if (m.id === id) return { ...m, order: other.order };
      if (m.id === other.id) return { ...m, order: sorted[idx].order };
      return m;
    });
    saveDB({ ...db, menus: updated });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Kelola Menu Link</h2>
          <p className="text-xs text-gray-500 mt-0.5">Tambah, edit, atau hapus link yang tampil di halaman utama</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors shadow-sm"
        >
          <Icon name="plus" size={15} /> Tambah Link
        </button>
      </div>

      {linkMenus.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-4xl mb-3">🔗</div>
          <p className="text-sm text-gray-500 mb-4">Belum ada menu link</p>
          <button onClick={openNew} className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600">
            Tambah Link Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {linkMenus.map((menu, idx) => (
            <div key={menu.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveLink(menu.id, -1)} disabled={idx === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-400">
                  <Icon name="arrowUp" size={12} />
                </button>
                <button onClick={() => moveLink(menu.id, 1)} disabled={idx === linkMenus.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-400">
                  <Icon name="arrowDown" size={12} />
                </button>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: menu.color + "22" }}>
                {menu.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm">{menu.title}</div>
                <div className="text-xs text-gray-400 truncate">{menu.url}</div>
                {menu.description && <div className="text-xs text-gray-400 truncate mt-0.5">{menu.description}</div>}
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {menu.roles.map(r => {
                    const role = db.roles.find(rl => rl.id === r);
                    return (
                      <span key={r} className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: role?.color }}>
                        {role?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a href={menu.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                  <Icon name="externalLink" size={14} />
                </a>
                <button onClick={() => openEdit(menu)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500">
                  <Icon name="edit" size={14} />
                </button>
                <button onClick={() => deleteLink(menu.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <LinkFormModal
          db={db}
          editing={!!editing}
          initialData={formData}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
