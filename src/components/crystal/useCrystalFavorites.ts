"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const CRYSTAL_FAVORITES_KEY = "crystal-case-library:favorites";

export function useCrystalFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(CRYSTAL_FAVORITES_KEY);
      setFavoriteIds(storedValue ? JSON.parse(storedValue) : []);
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  const writeFavorites = useCallback((nextFavoriteIds: string[]) => {
    setFavoriteIds(nextFavoriteIds);
    window.localStorage.setItem(
      CRYSTAL_FAVORITES_KEY,
      JSON.stringify(nextFavoriteIds)
    );
  }, []);

  const toggleFavorite = useCallback(
    (caseId: string) => {
      setFavoriteIds((current) => {
        const next = current.includes(caseId)
          ? current.filter((id) => id !== caseId)
          : [caseId, ...current];

        window.localStorage.setItem(
          CRYSTAL_FAVORITES_KEY,
          JSON.stringify(next)
        );
        return next;
      });
    },
    []
  );

  const clearFavorites = useCallback(() => {
    writeFavorites([]);
  }, [writeFavorites]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  return {
    favoriteIds,
    favoriteSet,
    toggleFavorite,
    clearFavorites
  };
}
