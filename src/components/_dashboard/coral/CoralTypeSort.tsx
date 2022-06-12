import { useTheme, styled } from '@material-ui/core/styles';
// material
import { MenuItem, TextField, Toolbar } from '@material-ui/core';
import useLocales from '../../../hooks/useLocales';
// ----------------------------------------------------------------------
const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 1)
  // padding: theme.spacing(0, 1, 0, 3)
}));

type CoralTypeSortProps = {
  query: string;
  options: { id: string; label: string }[];
  onSort: (value?: string) => void;
};

export default function CoralTypeSortProps({ query, options, onSort }: CoralTypeSortProps) {
  const { translate } = useLocales();
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <RootStyle
      sx={{
        color: isLight ? 'primary.main' : 'text.primary'
        // bgcolor: isLight ? 'primary.lighter' : 'primary.dark'
      }}
    >
      <TextField select size="small" value={query} onChange={(e) => onSort(e.target.value)}>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {translate(`status.coral_level_type.${option.id}`)}
          </MenuItem>
        ))}
      </TextField>
    </RootStyle>
  );
}
