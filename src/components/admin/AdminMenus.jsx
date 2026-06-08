import { useState } from "react";
import Icon from "../ui/Icon";
import SubmenuFormModal from "./SubmenuFormModal";

export default function AdminMenus({ db, saveDB }) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [showSubForm, setShowSubForm] = useState(false);
  const [subFormData, setSubFormData] = useState(null);
  const [subEditing, setSubEditing] = useState(null);
  const [parentMenu, setParentMenu] = useState(null);

  const emptyMenu = {
    title: "",
    icon: "📌",
    description: "",
    type: "link",
    url: "",
    color: "#3b82f6",
    roles: [],
    order: db.menus.length + 1,
  };

  const [form, setForm] = useState(emptyMenu);

  const openNewMenu = () => {
    setForm({ ...emptyMenu, order: db.menus.length + 1 });
    setEditing(null);
    setShowForm(true);
  };
  const openEditMenu = (menu) => {
    setForm({ ...menu });
    setEditing({ menuId: menu.id });
    setShowForm(true);
  };

  const openNewSub = (menu) => {
    setSubFormData({
      title: "",
      url: "",
      description: "",
      roles: [...menu.roles],
    });
    setParentMenu(menu);
    setSubEditing(null);
    setShowSubForm(true);
  };
  const openEditSub = (menu, sub) => {
    setSubFormData({ ...sub });
    setParentMenu(menu);
    setSubEditing({ menuId: menu.id, subId: sub.id });
    setShowSubForm(true);
  };

  const saveForm = () => {
    const newDB = { ...db, menus: [...db.menus] };
    if (editing) {
      newDB.menus = newDB.menus.map((m) =>
        m.id === editing.menuId ? { ...m, ...form, submenus: m.submenus } : m,
      );
    } else {
      newDB.menus.push({ ...form, id: Date.now(), submenus: [] });
    }
    saveDB(newDB);
    setShowForm(false);
  };

  const saveSubForm = (subForm, parentId) => {
    const newDB = { ...db, menus: [...db.menus] };
    if (subEditing) {
      newDB.menus = newDB.menus.map((m) =>
        m.id === subEditing.menuId
          ? {
              ...m,
              submenus: m.submenus.map((s) =>
                s.id === subEditing.subId ? { ...subForm } : s,
              ),
            }
          : m,
      );
    } else {
      newDB.menus = newDB.menus.map((m) =>
        m.id === parentId
          ? {
              ...m,
              submenus: [...m.submenus, { ...subForm, id: Date.now() }],
            }
          : m,
      );
    }
    saveDB(newDB);
    setShowSubForm(false);
  };

  const deleteMenu = (id) => {
    if (!confirm("Hapus menu ini?")) return;
    saveDB({ ...db, menus: db.menus.filter((m) => m.id !== id) });
  };
  const deleteSub = (menuId, subId) => {
    if (!confirm("Hapus sub-menu ini?")) return;
    saveDB({
      ...db,
      menus: db.menus.map((m) =>
        m.id === menuId
          ? { ...m, submenus: m.submenus.filter((s) => s.id !== subId) }
          : m,
      ),
    });
  };

  const moveMenu = (id, dir) => {
    const sorted = [...db.menus].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((m) => m.id === id);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === sorted.length - 1))
      return;
    const other = sorted[idx + dir];
    const updated = db.menus.map((m) => {
      if (m.id === id) return { ...m, order: other.order };
      if (m.id === other.id) return { ...m, order: sorted[idx].order };
      return m;
    });
    saveDB({ ...db, menus: updated });
  };

  const toggleRole = (role) => {
    const roles = form.roles || [];
    setForm((f) => ({
      ...f,
      roles: roles.includes(role)
        ? roles.filter((r) => r !== role)
        : [...roles, role],
    }));
  };

  const sorted = [...db.menus].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Kelola Menu</h2>
        <button
          onClick={openNewMenu}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors shadow-sm"
        >
          <Icon name="plus" size={15} /> Tambah Menu
        </button>
      </div>

      <div className="space-y-3">
        {sorted.map((menu, idx) => (
          <div
            key={menu.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
          >
            <div className="flex items-center gap-3 p-4">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveMenu(menu.id, -1)}
                  disabled={idx === 0}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-400"
                >
                  <Icon name="arrowUp" size={12} />
                </button>
                <button
                  onClick={() => moveMenu(menu.id, 1)}
                  disabled={idx === sorted.length - 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-400"
                >
                  <Icon name="arrowDown" size={12} />
                </button>
              </div>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: menu.color + "22" }}
              >
                {menu.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm">
                  {menu.title}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {menu.type === "folder"
                    ? `${menu.submenus.length} sub-menu`
                    : menu.url}
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {menu.roles.map((r) => {
                    const role = db.roles.find((rl) => rl.id === r);
                    return (
                      <span
                        key={r}
                        className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: role?.color }}
                      >
                        {role?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {menu.type === "folder" && (
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === menu.id ? null : menu.id)
                    }
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 text-xs"
                  >
                    <Icon
                      name={
                        expandedId === menu.id ? "chevronDown" : "chevronRight"
                      }
                      size={14}
                    />
                  </button>
                )}
                <button
                  onClick={() => openEditMenu(menu)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-500"
                >
                  <Icon name="edit" size={14} />
                </button>
                <button
                  onClick={() => deleteMenu(menu.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>

            {menu.type === "folder" && expandedId === menu.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-3 space-y-2">
                {menu.submenus.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-gray-100"
                  >
                    <Icon name="link" size={13} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-700">
                        {sub.title}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {sub.url}
                      </div>
                    </div>
                    <button
                      onClick={() => openEditSub(menu, sub)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"
                    >
                      <Icon name="edit" size={13} />
                    </button>
                    <button
                      onClick={() => deleteSub(menu.id, sub.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => openNewSub(menu)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 text-xs transition-colors"
                >
                  <Icon name="plus" size={13} /> Tambah Sub-Menu
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">
                {editing ? "Edit" : "Tambah"} Menu
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-xl hover:bg-gray-100"
              >
                <Icon name="x" size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Icon
                  </label>
                  <input
                    className="w-14 h-10 text-center rounded-xl border border-gray-200 text-xl"
                    value={form.icon}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, icon: e.target.value }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Warna
                  </label>
                  <input
                    type="color"
                    className="w-full h-10 rounded-xl border border-gray-200 cursor-pointer p-1"
                    value={form.color}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, color: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Judul *
                </label>
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Nama menu"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Deskripsi
                </label>
                <input
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Deskripsi singkat"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Tipe
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setForm((f) => ({ ...f, type: "link" }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${form.type === "link" ? "bg-indigo-500 text-white border-indigo-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    🔗 Link
                  </button>
                  <button
                    onClick={() => setForm((f) => ({ ...f, type: "folder" }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${form.type === "folder" ? "bg-indigo-500 text-white border-indigo-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    📁 Folder
                  </button>
                </div>
              </div>
              {form.type === "link" && (
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    URL *
                  </label>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, url: e.target.value }))
                    }
                    placeholder="https://..."
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">
                  Akses Role
                </label>
                <div className="flex flex-wrap gap-2">
                  {db.roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => toggleRole(r.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${(form.roles || []).includes(r.id) ? "text-white" : "text-gray-500 border-gray-200 bg-white hover:bg-gray-50"}`}
                      style={
                        (form.roles || []).includes(r.id)
                          ? { backgroundColor: r.color, borderColor: r.color }
                          : {}
                      }
                    >
                      {(form.roles || []).includes(r.id) && (
                        <Icon name="check" size={10} />
                      )}
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={saveForm}
                className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubForm && (
        <SubmenuFormModal
          db={db}
          editing={!!subEditing}
          initialData={subFormData}
          parentMenu={parentMenu}
          onSave={saveSubForm}
          onClose={() => setShowSubForm(false)}
        />
      )}
    </div>
  );
}
