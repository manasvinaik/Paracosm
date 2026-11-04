import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const LibraryContext = createContext(null);

const fromRow = (row) => ({
  id: row.id, title: row.title, creator: row.creator || "", category: row.category || "Other",
  status: row.status || "Want to read", rating: Number(row.rating || 0), year: row.release_year ?? "",
  image: row.cover_url || "", description: row.description || "", sourceUrl: row.source_url || "",
  createdAt: row.created_at, updatedAt: row.updated_at,
});

const toRow = (entry) => ({
  title: entry.title?.trim(), creator: entry.creator || null, category: entry.category || "Other",
  status: entry.status || "Want to read", rating: Number(entry.rating || 0) || null,
  release_year: entry.year ? Number(entry.year) : null, cover_url: entry.image || null,
  description: entry.description || null, source_url: entry.sourceUrl || null,
});

export function LibraryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshItems = useCallback(async () => {
    setLoading(true); setError("");
    const { data, error: queryError } = await supabase.from("media_items").select("*").order("created_at", { ascending: false });
    if (queryError) { setError(queryError.message); setItems([]); }
    else setItems((data || []).map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      if (session) await refreshItems(); else { setItems([]); setLoading(false); }
    };
    load();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) refreshItems(); else { setItems([]); setLoading(false); }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [refreshItems]);

  const addMedia = async (entry) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Please log in before adding media.");
    const { data, error: insertError } = await supabase.from("media_items").insert({ ...toRow(entry), user_id: user.id }).select().single();
    if (insertError) throw insertError;
    const item = fromRow(data); setItems(current => [item, ...current]); return item;
  };

  const updateMedia = async (id, changes) => {
    const { data, error: updateError } = await supabase.from("media_items").update(toRow(changes)).eq("id", id).select().single();
    if (updateError) throw updateError;
    const item = fromRow(data); setItems(current => current.map(x => String(x.id) === String(id) ? item : x)); return item;
  };

  const deleteMedia = async (id) => {
    const { error: deleteError } = await supabase.from("media_items").delete().eq("id", id);
    if (deleteError) throw deleteError;
    setItems(current => current.filter(x => String(x.id) !== String(id)));
  };

  const value = useMemo(() => ({ items, loading, error, refreshItems, addMedia, updateMedia, deleteMedia }), [items, loading, error, refreshItems]);
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("useLibrary must be used inside LibraryProvider");
  return context;
}
