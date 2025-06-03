import { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {
  Box,
  Card,
  Grid,
  Stack,
  Dialog,
  Divider,
  Tooltip,
  ImageList,
  CardHeader,
  Typography,
  IconButton,
  CardContent,
  ImageListItem,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useFormatDate } from 'src/utils/iso-date';
import { formatLongNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import { useGetTruckOrder } from '../../hooks/useTruckDetails';
import { ErrorData } from '../../../../components/error-data/error-data';
import Circular from '../../../../components/loading-screen/circular-screen';
import { MuiTimelineTracker } from '../../../package/ui/userPackages/TimeLineTracker';
import {
  OrderStatus,
  ShipmentTypeIcons,
  useShipmentTypeLabels,
  ShipmentTypeLabelsColors,
  useShipmentTooltipTypeLabels,
} from '../../../../types/TableStatus';

interface Props {
  orderID: string;
  onClose: () => void;
}

export const TruckOrderDetail = ({ orderID, onClose }: Props) => {
  const { t } = useTranslate('lang');
  const formatDate = useFormatDate();
  const tooltipLabels = useShipmentTooltipTypeLabels();
  const openViewImage = useBoolean();
  const [viewImage, setViewImage] = useState<string>('');
  const shipmentLabels = useShipmentTypeLabels();
  const { data, isLoading, error } = useGetTruckOrder(orderID);
  const theme = useTheme();
  if (isLoading) return <Circular />;
  if (error || !data) return <ErrorData />;

  return (
    <>
      <Card>
        <CardHeader
          sx={{ pb: 2, pt: 2, pl: 2 }}
          title={
            <Box display="flex" alignItems="center">
              <Typography variant="h6" color="text.secondary">
                {t('profile.profileTab.ordername')}:
              </Typography>
              <Typography variant="subtitle1" ml={1}>
                {data.description}
              </Typography>
            </Box>
          }
          action={
            <IconButton onClick={onClose}>
              <Iconify icon="ic:round-close" />
            </IconButton>
          }
          subheader={
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2" color="text.secondary">
                {t('profile.ordersTabs.card.title')}:
              </Typography>
              <Typography variant="subtitle2" ml={1}>
                {data.user.userId}
              </Typography>
            </Box>
          }
        />
        <Divider />
        <CardContent sx={{ px: 0, py: 2, ':last-child': { pb: 0 } }}>
          <Box pb={2} px={2}>
            <Stack direction="row" spacing={1} mb={2}>
              <Typography color="text.secondary" variant="subtitle1">
                {t('profile.ordersTabs.card.status')}:
              </Typography>
              <Tooltip
                title={
                  tooltipLabels[
                    data.statusHistory[data.statusHistory.length - 1]?.status as OrderStatus
                  ]
                }
                arrow
                placement="top"
              >
                {ShipmentTypeIcons[data.statusHistory[data.statusHistory.length - 1]?.status] ===
                '' ? (
                  <Label
                    color={
                      ShipmentTypeLabelsColors[
                        data.statusHistory[data.statusHistory.length - 1]?.status
                      ]
                    }
                  >
                    {
                      shipmentLabels[
                        data.statusHistory[data.statusHistory.length - 1]?.status as OrderStatus
                      ]
                    }
                  </Label>
                ) : (
                  <Label
                    color={
                      ShipmentTypeLabelsColors[
                        data.statusHistory[data.statusHistory.length - 1]?.status
                      ]
                    }
                    startIcon={
                      <Iconify
                        icon={
                          ShipmentTypeIcons[
                            data.statusHistory[data.statusHistory.length - 1]?.status
                          ]
                        }
                      />
                    }
                  >
                    {
                      shipmentLabels[
                        data.statusHistory[data.statusHistory.length - 1]?.status as OrderStatus
                      ]
                    }
                  </Label>
                )}
              </Tooltip>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={6} display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" variant="subtitle1">
                  {t('profile.ordersTabs.card.created')}:
                </Typography>
                <Typography variant="subtitle1" color="text.primary">
                  {formatDate(data.createdAt)}
                </Typography>
              </Grid>
              <Grid item xs={6} display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" variant="subtitle1">
                  {t('profile.ordersTabs.card.update')}:
                </Typography>
                <Typography variant="subtitle1" color="text.primary">
                  {formatDate(data.estimatedArrivalDate)}
                </Typography>
              </Grid>
              <Grid item xs={6} display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" variant="subtitle1">
                  {t('profile.ordersTabs.card.totalPlaces')}:
                </Typography>
                <Typography variant="subtitle1" color="text.primary">
                  {formatLongNumber(data.totalPlaces)}
                </Typography>
              </Grid>
              <Grid item xs={6} display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" variant="subtitle1">
                  {t('profile.ordersTabs.card.orderCount')}:
                </Typography>
                <Typography variant="subtitle1" color="text.primary">
                  {formatLongNumber(data.totalCount)}
                </Typography>
              </Grid>
              <Grid item xs={6} display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" variant="subtitle1">
                  {t('profile.ordersTabs.card.orderCapacity')}:
                </Typography>
                <Typography variant="subtitle1" color="text.primary">
                  {`${formatLongNumber(data.orderCapacity)}${t('profile.ordersTabs.card.m3')}`}
                </Typography>
              </Grid>

              <Grid item xs={6} display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" variant="subtitle1">
                  {t('profile.ordersTabs.card.orderWeight')}:
                </Typography>
                <Typography variant="subtitle1" color="text.primary">
                  {`${formatLongNumber(data.orderWeight)}${t('profile.ordersTabs.card.kg')}`}
                </Typography>
              </Grid>

              <Grid item xs={6} display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" variant="subtitle1">
                  {t('profile.ordersTabs.card.note')}:
                </Typography>
                <Typography variant="subtitle1" color="text.primary">
                  {data.note}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Box px={2} py={2}>
            <ImageList sx={{ margin: 0 }} cols={6} rowHeight={164}>
              {data.images.length ? (
                data.images.map((item) => (
                  <ImageListItem
                    sx={{ width: 164, height: 164 }}
                    onClick={() => {
                      setViewImage(item);
                      openViewImage.onTrue();
                    }}
                  >
                    <img
                      srcSet={item}
                      src={item}
                      alt="J"
                      loading="lazy"
                      width={1}
                      style={{
                        height: '100%',
                        borderRadius: 16,
                        border: `1px solid ${theme.palette.grey['400']}`,
                      }}
                    />
                  </ImageListItem>
                ))
              ) : (
                <Box />
              )}
            </ImageList>
          </Box>
          <Divider />
          <Box py={1}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {t('truckOrderDetails.timeLine')}
              </AccordionSummary>
              <AccordionDetails>
                <MuiTimelineTracker orderStatus={data.statusHistory} />
              </AccordionDetails>
            </Accordion>
          </Box>
        </CardContent>
      </Card>
      <Dialog
        onClose={() => {
          openViewImage.onFalse();
          setViewImage('');
        }}
        open={openViewImage.value}
      >
        <DialogContent sx={{ px: 0, position: 'relative' }}>
          <Box sx={{ position: 'absolute', zIndex: 10, right: 10, top: 10 }}>
            <IconButton
              onClick={openViewImage.onFalse}
              sx={{ bgcolor: '#f0f0f0', '&:hover': { bgcolor: '#fff' }, p: '5px' }}
            >
              <Iconify color="#000" width={20} icon="ic:round-close" />
            </IconButton>
          </Box>
          <img src={viewImage} alt="order" />
        </DialogContent>
      </Dialog>
    </>
  );
};
