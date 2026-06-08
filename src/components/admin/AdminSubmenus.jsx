import { useState } from "react";
import Icon from "../ui/Icon";
import SubmenuFormModal from "./SubmenuFormModal";

export default function AdminSubmenus({ db, saveDB }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(null);
  const [parentMenu, setParentMenu] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const folders = [...db.menus]
    .filter(m => m.type === "folder")
    .sort((a, b) => a.order - b.order);

  const openNew = (menu) => {
    setFormData({
      title: "",
      url: "",
      description: "",
      roles: menu?.roles || ["admin"],
    });
    setParentMenu(menu || null);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (menu, sub) => {
    setFormData({ ...sub });
    setParentMenu(menu);
    setEditing({ menuId: menu.id, subId: sub.id });
    setShowForm(true);
  };

  const handleSave = (form, parentId) => {
    const newDB = { ...db, menus: [...db.menus] };
    if (editing) {
      newDB.menus = newDB.menus.map(m => m.id === editing.menuId ? {
        ...m,
        submenus: m.submenus.map(s => s.id === editing.subId ? { ...form } : s),
      } : m);
    } else {
      newDB.menus = newDB.menus.map(m => m.id === parentId ? {
        ...m,
        submenus: [...m.submenus, { ...form, id: Date.now() }],
      } : m);
    }
    saveDB(newDB);
    setShowForm(false);
  };

  const deleteSub = (menuId, subId) => {
    if (!confirm("Hapus sub-menu ini?")) return;
    saveDB({
      ...db,
      menus: db.menus.map(m => m.id === menuId ? {
        ...m,
        submenus: m.submenus.filter(s => s.id !== subId),
      } : m),
    });
  };

  const moveSub = (menuId, subId, dir) => {
    const menu = db.menus.find(m => m.id === menuId);
    if (!menu) return;
    const subs = [...menu.submenus];
    const idx = subs.findIndex(s => s.id === subId);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === subs.length - 1)) return;
    [subs[idx], subs[idx + dir]] = [subs[idx + dir], subs[idx]];
    saveDB({
      ...db,
      menus: db.menus.map(m => m.id === menuId ? { ...m, submenus: subs } : m),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Kelola Sub-Menu</h2>
          <p className="text-xs text-gray-500 mt-0.5">Tambah, edit, atau hapus link di dalam folder</p>
        </div>
        {folders.length > 0 && (
          <button
            onClick={() => openNew()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors shadow-sm"
          >
            <Icon name="plus" size={15} /> Tambah Sub-Menu
          </button>
        )}
      </div>

      {folders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-sm text-gray-500">Belum ada folder. Buat folder dulu di tab Folder.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {folders.map(menu => (
            <div key={menu.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedId(expandedId === menu.id ? null : menu.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: menu.color + "22" }}>
                  {menu.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-sm">{menu.title}</div>
                  <div className="text-xs text-gray-400">{menu.submenus.length} sub-menu</div>
                </div>
                <Icon name={expandedId === menu.id ? "chevronDown" : "chevronRight"} size={16} />
              </button>

              {expandedId === menu.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-3 space-y-2">
                  {menu.submenus.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-3">Belum ada sub-menu</p>
                  ) : menu.submenus.map((sub, idx) => (
                    <div key={sub.id} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveSub(menu.id, sub.id, -1)} disabled={idx === 0} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-400">
                          <Icon name="arrowUp" size={10} />
                        </button>
                        <button onClick={() => moveSub(menu.id, sub.id, 1)} disabled={idx === menu.submenus.length - 1} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-400">
                          <Icon name="arrowDown" size={10} />
                        </button>
                      </div>
                      <Icon name="link" size={13} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700">{sub.title}</div>
                        <div className="text-xs text-gray-400 truncate">{sub.url}</div>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {sub.roles.map(r => {
                            const role = db.roles.find(rl => rl.id === r);
                            return (
                              <span key={r} className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: role?.color }}>
                                {role?.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <a href={sub.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                        <Icon name="externalLink" size={13} />
                      </a>
                      <button onClick={() => openEdit(menu, sub)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500">
                        <Icon name="edit" size={13} />
                      </button>
                      <button onClick={() => deleteSub(menu.id, sub.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => openNew(menu)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 text-xs transition-colors"
                  >
                    <Icon name="plus" size={13} /> Tambah Sub-Menu
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <SubmenuFormModal
          db={db}
          editing={!!editing}
          initialData={formData}
          parentMenu={parentMenu}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
