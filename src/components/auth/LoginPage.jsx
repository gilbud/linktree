import { useState } from "react";
import Icon from "../ui/Icon";

export default function LoginPage({ onLogin, db }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = db.users.find(u => u.username === username && u.password === password);
      if (user) onLogin(user);
      else setError("Username atau password salah.");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl mb-4 text-4xl">
            {db.profile.logo}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{db.profile.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{db.profile.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-5">Masuk ke Akun</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">Username</label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-800 text-sm bg-gray-50"
                placeholder="Masukkan username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-800 text-sm bg-gray-50 pr-10"
                  type={showPw ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPw(!showPw)}>
                  <Icon name={showPw ? "eyeOff" : "eye"} size={16} />
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-sky-200 mt-2"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Memverifikasi..." : "Masuk →"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Demo: admin / admin123
        </p>
      </div>
    </div>
  );
}
