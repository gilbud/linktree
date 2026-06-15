import { useState, useEffect, useCallback, useRef } from "react";
import { DB } from "../data/defaultDB";
import { fetchDB, saveDB as apiSaveDB } from "../lib/api";

export function useDB() {
  const [db, setDB] = useState(DB);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dbRef = useRef(db);
  dbRef.current = db;

  useEffect(() => {
    let cancelled = false;

    fetchDB()
      .then((data) => {
        if (!cancelled) {
          setDB(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const saveDB = useCallback((newDB) => {
    setDB(newDB);
    apiSaveDB(newDB).catch((err) => {
      console.error("Gagal menyimpan ke server:", err);
      setError(err.message);
    });
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDB();
      setDB(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { db, saveDB, loading, error, reload };
}
