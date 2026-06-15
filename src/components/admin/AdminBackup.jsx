import { useRef } from "react";
import { resetDB as apiResetDB } from "../../lib/api";

export default function AdminBackup({ db, saveDB }) {
  const fileInputRef = useRef();

  const downloadDB = () => {
    const content = `export const DB = ${JSON.stringify(db, null, 2)};`;

    const blob = new Blob([content], {
      type: "application/javascript",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "defaultDB.js";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const resetDB = async () => {
    if (!window.confirm("Reset database ke default?")) return;

    try {
      const fresh = await apiResetDB();
      saveDB(fresh);
    } catch (err) {
      alert("Gagal reset database: " + err.message);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Backup & Restore</h2>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
        <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-6 text-center border border-indigo-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow text-3xl mb-3">
            💾
          </div>

          <div className="font-bold text-gray-800">Database Management</div>

          <div className="text-xs text-gray-500 mt-1">
            Backup Database Briboy Portal
          </div>
        </div>

        <div className="grid gap-3">
          <button
            onClick={downloadDB}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm transition-all"
          >
            📥 Download Database
          </button>
          <button
            onClick={resetDB}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-all"
          >
            🔄 Reset Database
          </button>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4"></div>
      </div>
    </div>
  );
}
