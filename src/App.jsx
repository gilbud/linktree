import { useState } from "react";
import { useDB } from "./hooks/useDB";
import { login as apiLogin, setToken } from "./lib/api";
import LoginPage from "./components/auth/LoginPage";
import HomePage from "./components/home/HomePage";
import AdminPanel from "./components/admin/AdminPanel";

export default function App() {
  const { db, saveDB, loading, error, reload } = useDB();
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");

  const handleLogin = async (username, password) => {
    const { user: loggedIn, token } = await apiLogin(username, password);
    setToken(token);
    setUser(loggedIn);
    setView("home");
    return loggedIn;
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setView("login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-100">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">{db.profile?.logo || "🏢"}</div>
          <p className="text-sm text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error && view === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={reload}
            className="px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (view === "login") {
    return <LoginPage onLogin={handleLogin} db={db} />;
  }

  if (view === "admin" && user?.role === "admin") {
    return (
      <AdminPanel
        user={user}
        db={db}
        saveDB={saveDB}
        onBack={() => setView("home")}
      />
    );
  }

  return (
    <HomePage
      user={user}
      db={db}
      saveDB={saveDB}
      onAdmin={() => setView("admin")}
      onLogout={handleLogout}
    />
  );
}
