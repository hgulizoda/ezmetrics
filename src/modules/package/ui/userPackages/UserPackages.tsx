import { useState } from 'react';
import { useParams } from 'react-router';

import Accordion from '@mui/material/Accordion';
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
  useTheme,
  ImageList,
  CardHeader,
  Typography,
  IconButton,
  CardContent,
  ImageListItem,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useFormatDate } from 'src/utils/iso-date';
import { formatLongNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { NoData } from 'src/components/no-data copy/no-data';
import { ErrorData } from 'src/components/error-data/error-data';

import {
  OrderStatus,
  ShipmentTypeIcons,
  useShipmentTypeLabels,
  ShipmentTypeLabelsColors,
  useShipmentTooltipTypeLabels,
} from 'src/types/TableStatus';

import { MuiTimelineTracker } from './TimeLineTracker';
import { IProfileOrders } from '../../types/UserProfileOrders';
import { useGetProfileOrders } from '../../hook/useGetProfileOrders';

const UserPackages = () => {
  const shipmentLabels = useShipmentTypeLabels();
  const formatDate = useFormatDate();
  const tooltipLabels = useShipmentTooltipTypeLabels();
  const [viewImage, setViewImage] = useState<string>('');
  const openViewImage = useBoolean();
  const { t } = useTranslate('lang');
  const theme = useTheme();
  const params = useParams() as { id: string; status: string };
  const { profileOrders, error, isLoading } = useGetProfileOrders(params.id, params.status);

  if (error) return <ErrorData />;
  if (!profileOrders || isLoading) return <CircularProgress />;
  if (!profileOrders.length) return <NoData />;
  return (
    <>
      {profileOrders.map((order: IProfileOrders) => (
        <Card sx={{ mt: 3 }}>
          <CardHeader
            sx={{ pb: 2, pt: 2, pl: 2 }}
            title={
              <Box display="flex" alignItems="center">
                <Typography variant="h6" color="text.secondary">
                  {t('profile.profileTab.ordername')}:
                </Typography>
                <Typography variant="subtitle1" ml={1}>
                  {order.description}
                </Typography>
              </Box>
            }
            subheader={
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle2" color="text.secondary">
                  {t('profile.ordersTabs.card.title')}:
                </Typography>
                <Typography variant="subtitle2" ml={1}>
                  {order.user.userId}
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
                      order.statusHistory[order.statusHistory.length - 1]?.status as OrderStatus
                    ]
                  }
                  arrow
                  placement="top"
                >
                  {ShipmentTypeIcons[
                    order.statusHistory[order.statusHistory.length - 1]?.status
                  ] === '' ? (
                    <Label
                      color={
                        ShipmentTypeLabelsColors[
                          order.statusHistory[order.statusHistory.length - 1]?.status
                        ]
                      }
                    >
                      {
                        shipmentLabels[
                          order.statusHistory[order.statusHistory.length - 1]?.status as OrderStatus
                        ]
                      }
                    </Label>
                  ) : (
                    <Label
                      color={
                        ShipmentTypeLabelsColors[
                          order.statusHistory[order.statusHistory.length - 1]?.status
                        ]
                      }
                      startIcon={
                        <Iconify
                          icon={
                            ShipmentTypeIcons[
                              order.statusHistory[order.statusHistory.length - 1]?.status
                            ]
                          }
                        />
                      }
                    >
                      {
                        shipmentLabels[
                          order.statusHistory[order.statusHistory.length - 1]?.status as OrderStatus
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
                    {formatDate(order.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={6} display="flex" gap={1} alignItems="center">
                  <Typography color="text.secondary" variant="subtitle1">
                    {t('profile.ordersTabs.card.update')}:
                  </Typography>
                  <Typography variant="subtitle1" color="text.primary">
                    {formatDate(order.statusUpdatedAt)}
                  </Typography>
                </Grid>
                <Grid item xs={6} display="flex" gap={1} alignItems="center">
                  <Typography color="text.secondary" variant="subtitle1">
                    {t('profile.ordersTabs.card.totalPlaces')}:
                  </Typography>
                  <Typography variant="subtitle1" color="text.primary">
                    {formatLongNumber(order.totalPlaces)}
                  </Typography>
                </Grid>
                <Grid item xs={6} display="flex" gap={1} alignItems="center">
                  <Typography color="text.secondary" variant="subtitle1">
                    {t('profile.ordersTabs.card.orderCount')}:
                  </Typography>
                  <Typography variant="subtitle1" color="text.primary">
                    {formatLongNumber(order.totalCount)}
                  </Typography>
                </Grid>
                <Grid item xs={6} display="flex" gap={1} alignItems="center">
                  <Typography color="text.secondary" variant="subtitle1">
                    {t('profile.ordersTabs.card.orderCapacity')}:
                  </Typography>
                  <Typography variant="subtitle1" color="text.primary">
                    {`${formatLongNumber(order.orderCapacity)}${t('profile.ordersTabs.card.m3')}`}
                  </Typography>
                </Grid>

                <Grid item xs={6} display="flex" gap={1} alignItems="center">
                  <Typography color="text.secondary" variant="subtitle1">
                    {t('profile.ordersTabs.card.orderWeight')}:
                  </Typography>
                  <Typography variant="subtitle1" color="text.primary">
                    {`${formatLongNumber(order.orderWeight)}${t('profile.ordersTabs.card.kg')}`}
                  </Typography>
                </Grid>

                <Grid item xs={6} display="flex" gap={1} alignItems="center">
                  <Typography color="text.secondary" variant="subtitle1">
                    {t('profile.ordersTabs.card.note')}:
                  </Typography>
                  <Typography variant="subtitle1" color="text.primary">
                    {order.note}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box px={2} py={2}>
              <ImageList sx={{ margin: 0 }} cols={8} rowHeight={164}>
                {order.images.length ? (
                  order.images.map((item) => (
                    <ImageListItem
                      sx={{ width: 164, height: 164, cursor: 'pointer' }}
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
                  {t('profile.ordersTabs.card.timeline')}
                </AccordionSummary>
                <AccordionDetails>
                  <MuiTimelineTracker orderStatus={order.statusHistory} />
                </AccordionDetails>
              </Accordion>
            </Box>
          </CardContent>
        </Card>
      ))}

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

export default UserPackages;
