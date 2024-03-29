import { Icon } from '@iconify/react';
import polygonLight from '@iconify/icons-ph/polygon-light';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { getListGarden } from 'redux/slices/garden';
import { RootState, useDispatch, useSelector } from 'redux/store';
import useLocales from 'hooks/useLocales';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 1352831;

export default function AnalyticsGardens() {
  const dispatch = useDispatch();
  const { translate } = useLocales();
  const totalCount = useSelector((state: RootState) => state.garden.totalCount);

  useEffect(() => {
    dispatch(getListGarden(0, -1));
  }, [dispatch]);

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={polygonLight} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(totalCount)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {translate('menu.sidebarConfig.title.garden')}
      </Typography>
    </RootStyle>
  );
}
