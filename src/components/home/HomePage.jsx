import { useState } from "react";
import Icon from "../ui/Icon";
import MenuCard from "./MenuCard";
import LinkFormModal from "../admin/LinkFormModal";
import SubmenuFormModal from "../admin/SubmenuFormModal";

export default function HomePage({ user, db, saveDB, onAdmin, onLogout }) {
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [showSubForm, setShowSubForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [linkFormData, setLinkFormData] = useState(null);
  const [subFormData, setSubFormData] = useState(null);
  const [parentMenu, setParentMenu] = useState(null);

  const isAdmin = user.role === "admin";

  const visibleMenus = db.menus
    .filter(m => m.roles.includes(user.role))
    .sort((a, b) => a.order - b.order);

  const role = db.roles.find(r => r.id === user.role);

  const openNewLink = () => {
    setLinkFormData({
      title: "",
      icon: "🔗",
      description: "",
      type: "link",
      url: "",
      color: "#3b82f6",
      roles: ["admin", "keuangan", "operasional", "publik"],
      order: db.menus.length + 1,
    });
    setEditingLink(null);
    setShowLinkForm(true);
  };

  const openEditLink = (menu) => {
    setLinkFormData({ ...menu });
    setEditingLink(menu.id);
    setShowLinkForm(true);
  };

  const handleSaveLink = (form) => {
    const newDB = { ...db, menus: [...db.menus] };
    if (editingLink) {
      newDB.menus = newDB.menus.map(m =>
        m.id === editingLink ? { ...m, ...form, type: "link", submenus: m.submenus || [] } : m
      );
    } else {
      newDB.menus.push({ ...form, id: Date.now(), type: "link", submenus: [] });
    }
    saveDB(newDB);
    setShowLinkForm(false);
  };

  const handleDeleteLink = (id) => {
    if (!confirm("Hapus link ini?")) return;
    saveDB({ ...db, menus: db.menus.filter(m => m.id !== id) });
  };

  const openNewSub = (menu) => {
    setSubFormData({
      title: "",
      url: "",
      description: "",
      roles: [...menu.roles],
    });
    setParentMenu(menu);
    setEditingSub(null);
    setShowSubForm(true);
  };

  const openEditSub = (menu, sub) => {
    setSubFormData({ ...sub });
    setParentMenu(menu);
    setEditingSub({ menuId: menu.id, subId: sub.id });
    setShowSubForm(true);
  };

  const handleSaveSub = (form, parentId) => {
    const newDB = { ...db, menus: [...db.menus] };
    if (editingSub) {
      newDB.menus = newDB.menus.map(m => m.id === editingSub.menuId ? {
        ...m,
        submenus: m.submenus.map(s => s.id === editingSub.subId ? { ...form } : s),
      } : m);
    } else {
      newDB.menus = newDB.menus.map(m => m.id === parentId ? {
        ...m,
        submenus: [...m.submenus, { ...form, id: Date.now() }],
      } : m);
    }
    saveDB(newDB);
    setShowSubForm(false);
  };

  const handleDeleteSub = (menuId, subId) => {
    if (!confirm("Hapus sub-menu ini?")) return;
    saveDB({
      ...db,
      menus: db.menus.map(m => m.id === menuId ? {
        ...m,
        submenus: m.submenus.filter(s => s.id !== subId),
      } : m),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{db.profile.logo}</span>
            <span className="font-semibold text-gray-700 text-sm">{db.profile.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={onAdmin} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-medium hover:bg-indigo-100 transition-colors">
                <Icon name="settings" size={13} /> Admin
              </button>
            )}
            <button onClick={onLogout || (() => window.location.reload())} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-xs font-medium hover:bg-gray-100 transition-colors">
              <Icon name="logout" size={13} /> Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-8 pb-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-lg mb-3 text-3xl">
          {db.profile.logo}
        </div>
        <h1 className="text-xl font-bold text-gray-800">{db.profile.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{db.profile.subtitle}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: role?.color }}>
          <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
          Halo, {user.name}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-8 space-y-2">
        {isAdmin && (
          <button
            onClick={openNewLink}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-dashed border-indigo-300 text-indigo-600 text-sm font-medium hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
          >
            <Icon name="plus" size={16} /> Tambah Link Baru
          </button>
        )}

        {visibleMenus.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🔒</div>
            <p className="text-sm">Tidak ada menu yang tersedia untuk role Anda.</p>
          </div>
        ) : visibleMenus.map(menu => (
          <MenuCard
            key={menu.id}
            menu={menu}
            isAdmin={isAdmin}
            userRole={user.role}
            onEdit={openEditLink}
            onDelete={handleDeleteLink}
            onEditSub={openEditSub}
            onDeleteSub={handleDeleteSub}
            onAddSub={openNewSub}
          />
        ))}
      </div>

      {showLinkForm && (
        <LinkFormModal
          db={db}
          editing={!!editingLink}
          initialData={linkFormData}
          onSave={handleSaveLink}
          onClose={() => setShowLinkForm(false)}
        />
      )}

      {showSubForm && (
        <SubmenuFormModal
          db={db}
          editing={!!editingSub}
          initialData={subFormData}
          parentMenu={parentMenu}
          onSave={handleSaveSub}
          onClose={() => setShowSubForm(false)}
        />
      )}
    </div>
  );
}
