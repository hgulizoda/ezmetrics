import React from 'react';

import { useTheme, Typography } from '@mui/material';
import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';
import { PulseIcon } from 'src/assets/icons/pulse';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { useTimelineProgress } from '../../libs/updateTimeLineStatus';

interface IProps {
  orderStatus: {
    status: string;
    date: string;
  }[];
}

export function MuiTimelineTracker({ orderStatus }: IProps) {
  const { t } = useTranslate('lang');
  const formatDate = useFormatDate();
  const newProgress = useTimelineProgress(orderStatus);
  const theme = useTheme();

  // 🔥 Refactored: Get status color
  const getStatusColor = (status: string) =>
    ({
      completed: theme.palette.primary.dark,
      current: theme.palette.warning.dark,
    })[status] || theme.palette.grey[600];

  // 🔥 Refactored: Get label color
  const getLabelColor = (status: string): 'primary' | 'warning' | 'default' => {
    const statusColors: Record<string, 'primary' | 'warning' | 'default'> = {
      completed: 'primary',
      current: 'warning',
    };

    return statusColors[status] ?? 'default';
  };

  // 🔥 Refactored: Get label name
  const getLabelName = (status: string) =>
    ({
      completed: t('timeLineProcess.complete'),
      current: t('timeLineProcess.current'),
    })[status] || t('timeLineProcess.waiting');

  // 🔥 Refactored: Get status icon
  const getStatusIcon = (progress: string) => {
    const iconMap: Record<string, JSX.Element> = {
      completed: <Iconify icon="gg:check-o" width={35} color={theme.palette.primary.dark} />,
      pending: <Iconify icon="mdi:progress-clock" width={35} color={theme.palette.grey[600]} />,
      current: <PulseIcon />,
    };
    return iconMap[progress] || null;
  };

  // 🔥 Refactored: Get flag icon (Uzbekistan or China flag)
  const flagIcons: Record<string, string> = {
    Bojxona: 'twemoji:flag-uzbekistan',
    Ombor: 'twemoji:flag-china',
  };

  return (
    <Timeline
      position="right"
      sx={{
        [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
        py: 0,
        my: 0,
      }}
    >
      {newProgress.map((step, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot sx={{ p: 0, my: 0.5, backgroundColor: 'transparent' }}>
              {getStatusIcon(step.progress)}
            </TimelineDot>

            {index !== newProgress.length - 1 && (
              <TimelineConnector sx={{ bgcolor: getStatusColor(step.progress) }} />
            )}
          </TimelineSeparator>

          <TimelineContent sx={{ py: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              display="flex"
              alignItems="center"
              gap={0.5}
              color={getStatusColor(step.progress)}
            >
              {step.title} {flagIcons[step.title] && <Iconify icon={flagIcons[step.title]} />}
            </Typography>

            <Typography display="flex" gap={1} variant="subtitle2" color="textSecondary">
              {step.date && formatDate(step.date)}
              <Label color={getLabelColor(step.progress)}>{getLabelName(step.progress)}</Label>
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
