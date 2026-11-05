<<<<<<< HEAD

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

=======
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
>>>>>>> 5d050b94f5e6a0cde40183f9a3973b17b4bc73e2
import { supabase } from "../lib/supabaseClient";

const LibraryContext = createContext(null);

<<<<<<< HEAD
// ============================================================
// DEFAULT SHELVES
// ============================================================

export const DEFAULT_SHELVES = [
  { name: "Books", icon: "▤", color: "tile-mint" },
  { name: "Movies", icon: "▣", color: "tile-peach" },
  { name: "TV Shows", icon: "▥", color: "tile-blue" },
  { name: "Fanfictions", icon: "♡", color: "tile-pink" },
  { name: "Anime", icon: "✧", color: "tile-blue" },
  { name: "Manga & Manhwa", icon: "▧", color: "tile-peach" },
  { name: "Webnovels", icon: "✦", color: "tile-mint" },
  { name: "Board Games", icon: "♟", color: "tile-blue" },
  { name: "Other", icon: "✧", color: "tile-pink" },
];

// ============================================================
// DATABASE MAPPERS
// ============================================================

const fromRow = (row) => ({
  id: row.id,
  title: row.title,
  creator: row.creator || "",
  category: row.category || "Other",
  status: row.status || "Want to read",
  rating: Number(row.rating || 0),
  year: row.release_year ?? "",
  image: row.cover_url || "",
  description: row.description || "",
  sourceUrl: row.source_url || "",
  metadataSource: row.metadata_source || "",
  externalId: row.external_id || "",
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toRow = (entry) => ({
  title: entry.title?.trim(),
  creator: entry.creator || null,
  category: entry.category || "Other",
  status: entry.status || "Want to read",
  rating: Number(entry.rating || 0) || null,
  release_year: entry.year ? Number(entry.year) : null,
  cover_url: entry.image || null,
  description: entry.description || null,
  source_url: entry.sourceUrl || null,
  metadata_source: entry.metadataSource || null,
  external_id: entry.externalId || null,
});

// ============================================================
// LIBRARY PROVIDER
// ============================================================

export function LibraryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // REFRESH LIBRARY
  // ==========================================================

  const refreshItems = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setItems([]);
      setCustomCategories([]);
      setLoading(false);
      return;
    }

    // Fetch existing shelves.
    let {
      data: categoryRows,
      error: categoryError,
    } = await supabase
      .from("categories")
      .select("id,user_id,name,icon,color,is_custom")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (!categoryError) {
      /*
       * IMPORTANT:
       * Only create default shelves when the user has
       * absolutely no shelves.
       *
       * This prevents deleted default shelves from
       * automatically reappearing on refresh.
       */

      if (!categoryRows || categoryRows.length === 0) {
        const defaults = DEFAULT_SHELVES.map((shelf) => ({
          user_id: user.id,
          ...shelf,
          is_custom: false,
        }));

        const { error: seedError } = await supabase
          .from("categories")
          .upsert(defaults, {
            onConflict: "user_id,name",
            ignoreDuplicates: true,
          });

        if (seedError) {
          setError(
            `Couldn't initialise your shelves: ${seedError.message}`
          );
        }

        // Reload shelves after initialisation.
        const refreshed = await supabase
          .from("categories")
          .select("id,user_id,name,icon,color,is_custom")
          .eq("user_id", user.id)
          .order("name", { ascending: true });

        if (!refreshed.error) {
          categoryRows = refreshed.data;
        } else {
          setError(
            `Couldn't reload your shelves: ${refreshed.error.message}`
          );
        }
      }

      setCustomCategories(categoryRows || []);
    } else {
      setCustomCategories([]);
      setError(
        `Couldn't load your shelves: ${categoryError.message}`
      );
    }

    // Fetch media entries.
    const {
      data,
      error: queryError,
    } = await supabase
      .from("media_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setItems([]);
    } else {
      setItems((data || []).map(fromRow));
    }

    setLoading(false);
  }, []);

  // ==========================================================
  // CREATE SHELF
  // ==========================================================

  const createCategory = async (rawName) => {
    const name = rawName.trim().replace(/\s+/g, " ");

    if (!name) {
      throw new Error("Enter a shelf name.");
    }

    if (
      customCategories.some(
        (x) => x.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      throw new Error("That shelf already exists.");
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Please log in before creating a shelf.");
    }

    const {
      data,
      error: insertError,
    } = await supabase
      .from("categories")
      .insert({
        user_id: user.id,
        name,
        icon: "✦",
        color: "tile-lilac",
        is_custom: true,
      })
      .select("id,user_id,name,icon,color,is_custom")
      .single();

    if (insertError) throw insertError;

    setCustomCategories((current) =>
      [...current, data].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );

    return data;
  };

  // ==========================================================
  // RENAME SHELF
  // ==========================================================

  const updateCategory = async (id, rawName) => {
    const name = rawName.trim().replace(/\s+/g, " ");

    if (!name) {
      throw new Error("Shelf name cannot be empty.");
    }

    const current = customCategories.find(
      (x) => String(x.id) === String(id)
    );

    if (!current) {
      throw new Error("Shelf not found. Refresh and try again.");
    }

    if (
      customCategories.some(
        (x) =>
          String(x.id) !== String(id) &&
          x.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      throw new Error("A shelf with that name already exists.");
    }

    if (current.name === name) return current;

    const {
      data: matchingItems,
      error: lookupError,
    } = await supabase
      .from("media_items")
      .select("id")
      .eq("category", current.name);

    if (lookupError) throw lookupError;

    const itemIds = (matchingItems || []).map(
      (item) => item.id
    );

    // Update media categories first.
    if (itemIds.length) {
      const { error: mediaError } = await supabase
        .from("media_items")
        .update({ category: name })
        .in("id", itemIds);

      if (mediaError) throw mediaError;
    }

    // Update the shelf name.
    const {
      data,
      error: updateError,
    } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id)
      .select("id,user_id,name,icon,color,is_custom")
      .single();

    if (updateError) {
      // Restore original media categories if rename fails.
      if (itemIds.length) {
        await supabase
          .from("media_items")
          .update({ category: current.name })
          .in("id", itemIds);
      }

      throw updateError;
    }

    setCustomCategories((rows) =>
      rows
        .map((row) =>
          String(row.id) === String(id) ? data : row
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    );

    setItems((rows) =>
      rows.map((item) =>
        item.category === current.name
          ? { ...item, category: name }
          : item
      )
    );

    return data;
  };

  // ==========================================================
  // DELETE SHELF
  // ==========================================================

  const deleteCategory = async (id) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Please log in before deleting a shelf.");
    }

    const current = customCategories.find(
      (x) => String(x.id) === String(id)
    );

    if (!current) {
      throw new Error("Shelf not found. Refresh and try again.");
    }

    if (customCategories.length <= 1) {
      throw new Error("Keep at least one shelf in your archive.");
    }

    const fallback = customCategories.find(
      (x) => String(x.id) !== String(id)
    );

    if (!fallback) {
      throw new Error("No alternative shelf is available.");
    }

    // Find media assigned to this shelf.
    const {
      data: matchingItems,
      error: lookupError,
    } = await supabase
      .from("media_items")
      .select("id")
      .eq("category", current.name)
      .eq("user_id", user.id);

    if (lookupError) throw lookupError;

    const itemIds = (matchingItems || []).map(
      (item) => item.id
    );

    // Move media entries to another shelf.
    if (itemIds.length > 0) {
      const { error: mediaError } = await supabase
        .from("media_items")
        .update({ category: fallback.name })
        .in("id", itemIds)
        .eq("user_id", user.id);

      if (mediaError) throw mediaError;
    }

    // Delete the actual shelf from Supabase.
    const {
      data: deleted,
      error: deleteError,
    } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (deleteError || !deleted) {
      // Restore media assignments if deletion fails.
      if (itemIds.length > 0) {
        await supabase
          .from("media_items")
          .update({ category: current.name })
          .in("id", itemIds)
          .eq("user_id", user.id);
      }

      throw (
        deleteError ||
        new Error(
          "The shelf wasn't deleted. Check your Supabase permissions."
        )
      );
    }

    // Update the React state.
    setCustomCategories((rows) =>
      rows.filter(
        (row) => String(row.id) !== String(id)
      )
    );

    setItems((rows) =>
      rows.map((item) =>
        item.category === current.name
          ? { ...item, category: fallback.name }
          : item
      )
    );
  };

  // ==========================================================
  // AUTHENTICATION LISTENER
  // ==========================================================

  useEffect(() => {
    let active = true;

    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (session) {
        await refreshItems();
      } else {
        setItems([]);
        setCustomCategories([]);
        setLoading(false);
      }
    };

    load();

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          refreshItems();
        } else {
          setItems([]);
          setCustomCategories([]);
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshItems]);

  // ==========================================================
  // ADD MEDIA
  // ==========================================================

  const addMedia = async (entry) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Please log in before adding media.");
    }

    const {
      data,
      error: insertError,
    } = await supabase
      .from("media_items")
      .insert({
        ...toRow(entry),
        user_id: user.id,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    const item = fromRow(data);

    setItems((current) => [item, ...current]);

    return item;
  };

  // ==========================================================
  // UPDATE MEDIA
  // ==========================================================

  const updateMedia = async (id, changes) => {
    const {
      data,
      error: updateError,
    } = await supabase
      .from("media_items")
      .update(toRow(changes))
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    const item = fromRow(data);

    setItems((current) =>
      current.map((x) =>
        String(x.id) === String(id) ? item : x
      )
    );

    return item;
  };

  // ==========================================================
  // DELETE MEDIA
  // ==========================================================

  const deleteMedia = async (id) => {
    const { error: deleteError } = await supabase
      .from("media_items")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    setItems((current) =>
      current.filter((x) => String(x.id) !== String(id))
    );
  };

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = useMemo(
    () => ({
      items,
      customCategories,
      shelves: customCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      loading,
      error,
      refreshItems,
      addMedia,
      updateMedia,
      deleteMedia,
    }),
    [
      items,
      customCategories,
      loading,
      error,
      refreshItems,
    ]
  );

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

// ============================================================
// LIBRARY HOOK
// ============================================================

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error(
      "useLibrary must be used inside LibraryProvider"
    );
  }

=======
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
>>>>>>> 5d050b94f5e6a0cde40183f9a3973b17b4bc73e2
  return context;
}
