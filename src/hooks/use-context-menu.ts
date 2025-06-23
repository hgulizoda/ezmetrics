import { useState } from 'react';

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );

    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setTimeout(() => selection.addRange(range));
    }
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  return {
    contextMenu,
    handleContextMenu,
    handleClose,
  };
}
