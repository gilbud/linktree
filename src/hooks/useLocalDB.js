import { useState } from "react";
import { DB } from "../data/defaultDB";

export function useLocalDB() {
  const [db, setDB] = useState(() => {
    try { return JSON.parse(localStorage.getItem("linktree_db")) || DB; } catch { return DB; }
  });
  const save = (newDB) => { setDB(newDB); localStorage.setItem("linktree_db", JSON.stringify(newDB)); };
  return [db, save];
}
