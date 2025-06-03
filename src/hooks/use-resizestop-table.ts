import { useState, useEffect, useCallback } from 'react';

export interface BaseColumn {
  field: string;
  width?: number;
}
interface SavedWidths {
  [key: string]: number;
}

/**
 * @param storageKey Unique key for localStorage.
 * @param initialColumns The initial columns array of generic type T.
 * @returns An object containing the updated columns and a resize handler.
 */
function usePersistedColumnWidths<T extends BaseColumn>(storageKey: string, initialColumns: T[]) {
  const [columns, setColumns] = useState<T[]>(initialColumns);
  useEffect(() => {
    const savedWidthsStr = localStorage.getItem(storageKey);
    if (savedWidthsStr) {
      try {
        const savedWidths: SavedWidths = JSON.parse(savedWidthsStr);
        setColumns((prevColumns) =>
          prevColumns.map((col) => ({
            ...col,
            width: savedWidths[col.field] ?? col.width,
          }))
        );
      } catch (error) {
        console.error('Error parsing saved column widths', error);
      }
    }
  }, [storageKey]);
  const handleColumnResizeStop = useCallback(
    (params: { colDef: T; width: number }) => {
      const { colDef, width } = params;
      const savedWidthsStr = localStorage.getItem(storageKey);
      let savedWidths: SavedWidths = {};
      if (savedWidthsStr) {
        try {
          savedWidths = JSON.parse(savedWidthsStr);
        } catch (error) {
          console.error('Error parsing saved column widths', error);
        }
      }
      savedWidths[colDef.field] = width;
      localStorage.setItem(storageKey, JSON.stringify(savedWidths));
    },
    [storageKey]
  );
  return { columns, handleColumnResizeStop };
}

export default usePersistedColumnWidths;
