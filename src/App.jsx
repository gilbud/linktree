import { useState } from "react";
import { useLocalDB } from "./hooks/useLocalDB";
import LoginPage from "./components/auth/LoginPage";
import HomePage from "./components/home/HomePage";
import AdminPanel from "./components/admin/AdminPanel";

export default function App() {
  const [db, saveDB] = useLocalDB();
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");

  const handleLogin = (u) => { setUser(u); setView("home"); };

  if (view === "login") return <LoginPage onLogin={handleLogin} db={db} />;
  if (view === "admin" && user?.role === "admin") return <AdminPanel user={user} db={db} saveDB={saveDB} onBack={() => setView("home")} />;
  return <HomePage user={user} db={db} saveDB={saveDB} onAdmin={() => setView("admin")} />;
}
