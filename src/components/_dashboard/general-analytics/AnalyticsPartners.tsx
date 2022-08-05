import { Icon } from '@iconify/react';
import handshakeIcon from '@iconify/icons-fa6-regular/handshake';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { Card, Typography } from '@material-ui/core';
import { getListPartner } from 'redux/slices/partner';
import { RootState, useDispatch, useSelector } from 'redux/store';
import useLocales from 'hooks/useLocales';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
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
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;

export default function AnalyticsPartners() {
  const dispatch = useDispatch();
  const { translate } = useLocales();
  const totalCount = useSelector((state: RootState) => state.partner.totalCount);

  useEffect(() => {
    dispatch(getListPartner(0, -1));
  }, [dispatch]);

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={handshakeIcon} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(totalCount)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {translate('menu.sidebarConfig.title.partner')}
      </Typography>
    </RootStyle>
  );
}
