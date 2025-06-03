import React, { useState, useEffect } from 'react';

// MUI Icon
import { GridDensity } from '@mui/x-data-grid';
import { Box, Menu, MenuItem, IconButton } from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from '../iconify';

interface DensitySelectorProps {
  onDensityChange: (density: GridDensity) => void;
}

export const Density: React.FC<DensitySelectorProps> = ({ onDensityChange }) => {
  const storedDensity = (localStorage.getItem('gridDensity') as GridDensity) || 'standard';
  const [density, setDensity] = useState<GridDensity>(storedDensity);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslate('lang');
  useEffect(() => {
    localStorage.setItem('gridDensity', density);
    onDensityChange(density);
  }, [density, onDensityChange]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectDensity = (newDensity: GridDensity) => {
    setDensity(newDensity);
    handleCloseMenu();
  };

  return (
    <Box>
      <IconButton onClick={handleOpenMenu}>
        <Iconify icon="lsicon:density-m-filled" color="black" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={() => handleSelectDensity('compact')} selected={density === 'compact'}>
          {t('density.compact')}
        </MenuItem>
        <MenuItem onClick={() => handleSelectDensity('standard')} selected={density === 'standard'}>
          {t('density.standart')}
        </MenuItem>
        <MenuItem
          onClick={() => handleSelectDensity('comfortable')}
          selected={density === 'comfortable'}
        >
          {t('density.comfortable')}
        </MenuItem>
      </Menu>
    </Box>
  );
};
