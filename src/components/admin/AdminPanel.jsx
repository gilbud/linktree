import { useState } from "react";
import Icon from "../ui/Icon";
import AdminMenus from "./AdminMenus";
import AdminLinks from "./AdminLinks";
import AdminSubmenus from "./AdminSubmenus";
import AdminUsers from "./AdminUsers";
import AdminProfile from "./AdminProfile";
import AdminBackup from "./AdminBackup";

export default function AdminPanel({ user, db, saveDB, onBack }) {
  const [tab, setTab] = useState("links");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <Icon name="x" size={18} />
            </button>
            <span className="font-bold text-gray-800">Panel Admin</span>
          </div>
          <div className="text-xs text-gray-500">Login: {user.name}</div>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex gap-1 pb-0">
          {[
            { id: "links", icon: "link", label: "Link" },
            { id: "submenus", icon: "link", label: "Sub-Menu" },
            { id: "menus", icon: "folder", label: "Folder" },
            { id: "users", icon: "users", label: "Pengguna" },
            { id: "profile", icon: "settings", label: "Profil" },
            { id: "backup", icon: "download", label: "Backup" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {tab === "links" && <AdminLinks db={db} saveDB={saveDB} />}
        {tab === "submenus" && <AdminSubmenus db={db} saveDB={saveDB} />}
        {tab === "menus" && <AdminMenus db={db} saveDB={saveDB} />}
        {tab === "users" && <AdminUsers db={db} saveDB={saveDB} />}
        {tab === "profile" && <AdminProfile db={db} saveDB={saveDB} />}
        {tab === "backup" && <AdminBackup db={db} saveDB={saveDB} />}
      </div>
    </div>
  );
}
