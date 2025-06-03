import { useState, useEffect, useCallback } from 'react';

export type ColumnVisibilityModel = { [field: string]: boolean };
function usePersistedColumnVisibilityModel(
  storageKey: string,
  initialModel: ColumnVisibilityModel = {}
) {
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<ColumnVisibilityModel>(initialModel);
  useEffect(() => {
    const storedModel = localStorage.getItem(storageKey);
    if (storedModel) {
      try {
        const parsedModel: ColumnVisibilityModel = JSON.parse(storedModel);
        setColumnVisibilityModel(parsedModel);
      } catch (error) {
        console.error('Error parsing stored column visibility model:', error);
      }
    }
  }, [storageKey]);
  const handleColumnVisibilityModelChange = useCallback(
    (newModel: ColumnVisibilityModel) => {
      setColumnVisibilityModel(newModel);
      localStorage.setItem(storageKey, JSON.stringify(newModel));
    },
    [storageKey]
  );

  return { columnVisibilityModel, handleColumnVisibilityModelChange };
}

export default usePersistedColumnVisibilityModel;
