import { useState } from "react";
import Icon from "../ui/Icon";

export default function MenuCard({
  menu,
  isAdmin,
  userRole,
  onEdit,
  onDelete,
  onEditSub,
  onDeleteSub,
  onAddSub,
}) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (menu.type === "link") window.open(menu.url, "_blank");
    else setOpen(!open);
  };

  const visibleSubmenus = isAdmin
    ? (menu.submenus || [])
    : (menu.submenus?.filter(sub => sub.roles?.includes(userRole)) || []);

  return (
    <div className="w-full">
      <div className="relative group">
        <button
          onClick={handleClick}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-white border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left active:scale-98 shadow-sm"
          style={{ borderLeftWidth: 4, borderLeftColor: menu.color }}
        >
          <span className="text-2xl flex-shrink-0">{menu.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 text-sm">{menu.title}</div>
            {menu.description && <div className="text-xs text-gray-400 truncate">{menu.description}</div>}
          </div>
          <div className="flex-shrink-0 text-gray-400">
            {menu.type === "folder"
              ? <Icon name={open ? "chevronDown" : "chevronRight"} size={16} />
              : <Icon name="externalLink" size={14} />
            }
          </div>
        </button>

        {isAdmin && menu.type === "link" && (
          <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(menu); }}
              className="p-1.5 rounded-lg bg-blue-500 text-white shadow-md hover:bg-blue-600"
              title="Edit link"
            >
              <Icon name="edit" size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(menu.id); }}
              className="p-1.5 rounded-lg bg-red-500 text-white shadow-md hover:bg-red-600"
              title="Hapus link"
            >
              <Icon name="trash" size={12} />
            </button>
          </div>
        )}
      </div>

      {menu.type === "folder" && open && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 pl-3" style={{ borderColor: menu.color + "44" }}>
          {visibleSubmenus.map(sub => (
            <div key={sub.id} className="relative group/sub">
              <button
                onClick={() => window.open(sub.url, "_blank")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left text-sm"
              >
                <Icon name="link" size={14} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-700 text-sm">{sub.title}</div>
                  {sub.description && <div className="text-xs text-gray-400 truncate">{sub.description}</div>}
                </div>
                <Icon name="externalLink" size={12} />
              </button>

              {isAdmin && (
                <div className="absolute -top-1.5 -right-1.5 flex gap-0.5 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditSub(menu, sub); }}
                    className="p-1 rounded-md bg-blue-500 text-white shadow hover:bg-blue-600"
                    title="Edit sub-menu"
                  >
                    <Icon name="edit" size={10} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteSub(menu.id, sub.id); }}
                    className="p-1 rounded-md bg-red-500 text-white shadow hover:bg-red-600"
                    title="Hapus sub-menu"
                  >
                    <Icon name="trash" size={10} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {isAdmin && (
            <button
              onClick={() => onAddSub(menu)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-dashed border-indigo-300 text-indigo-500 text-xs font-medium hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
            >
              <Icon name="plus" size={12} /> Tambah Sub-Menu
            </button>
          )}

          {visibleSubmenus.length === 0 && !isAdmin && (
            <p className="text-xs text-gray-400 text-center py-2">Tidak ada sub-menu tersedia.</p>
          )}
        </div>
      )}
    </div>
  );
}
