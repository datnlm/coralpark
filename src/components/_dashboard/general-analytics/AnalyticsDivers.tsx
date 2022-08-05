import { Icon } from '@iconify/react';
import windowsFilled from '@iconify/icons-ant-design/windows-filled';
import scubaMask from '@iconify/icons-tabler/scuba-mask';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { Card, Typography } from '@material-ui/core';
import { getListDiver } from 'redux/slices/diver';
import { RootState, useDispatch, useSelector } from 'redux/store';
import useLocales from 'hooks/useLocales';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter
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
  color: theme.palette.warning.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
    theme.palette.warning.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 1723315;

export default function AnalyticsDivers() {
  const dispatch = useDispatch();
  const { translate } = useLocales();
  const totalCount = useSelector((state: RootState) => state.diver.totalCount);

  useEffect(() => {
    dispatch(getListDiver(0, -1));
  }, [dispatch]);

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={scubaMask} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(totalCount)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {translate('menu.sidebarConfig.title.diver')}
      </Typography>
    </RootStyle>
  );
}
