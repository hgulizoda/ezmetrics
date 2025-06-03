import { m } from 'framer-motion';
import { useCallback } from 'react';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import type { IconButtonProps } from '@mui/material/IconButton';

import type { LanguageValue } from 'src/locales';
import { allLangs, useTranslate } from 'src/locales';

import { varHover } from 'src/components/animate';
import { FlagIcon } from 'src/components/iconify/flag-icon';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export type LanguagePopoverProps = IconButtonProps & {
  data?: {
    value: string;
    label: string;
    countryCode: string;
  }[];
};

export function LanguagePopover({ data = [], sx, ...other }: LanguagePopoverProps) {
  const popover = usePopover();
  const { onChangeLang, currentLang } = useTranslate();

  const handleChangeLang = useCallback(
    (newLang: LanguageValue) => {
      onChangeLang(newLang);
      popover.onClose();
    },
    [onChangeLang, popover]
  );
  const fallbackLang = allLangs?.find((lang) => lang.value === 'uz') || allLangs[0];
  const safeCurrentLang = currentLang || fallbackLang;

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          p: 0,
          width: 40,
          height: 40,
          ...(popover.open && { bgcolor: 'action.selected' }),
          ...sx,
        }}
        {...other}
      >
        <FlagIcon code={currentLang?.countryCode} />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <MenuList sx={{ width: 160, minHeight: 72 }}>
          {data?.length > 0 ? (
            data.map((option) => (
              <MenuItem
                key={option?.value}
                selected={option?.value === safeCurrentLang.value}
                onClick={() => handleChangeLang(option?.value as LanguageValue)}
              >
                <FlagIcon code={option?.countryCode} sx={{ mr: 1 }} />
                {option?.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No languages available</MenuItem>
          )}
        </MenuList>
      </CustomPopover>
    </>
  );
}
