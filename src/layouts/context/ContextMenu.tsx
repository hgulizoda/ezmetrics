// ContextMenuWrapper.tsx
import * as React from 'react';

import Menu from '@mui/material/Menu';

import { useContextMenu } from 'src/hooks/use-context-menu';

interface Props {
  children: React.ReactNode;
  menu: React.ReactNode;
}

export function ContextMenuWrapper({ children, menu }: Props) {
  const { contextMenu, handleContextMenu, handleClose } = useContextMenu();

  return (
    <div onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
      {children}

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
        }
      >
        {menu}
      </Menu>
    </div>
  );
}
