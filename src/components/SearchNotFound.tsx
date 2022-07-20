import { Paper, PaperProps, Typography } from '@material-ui/core';
import useLocales from '../hooks/useLocales';
// ----------------------------------------------------------------------

interface SearchNotFoundProps extends PaperProps {
  searchQuery?: string;
}

export default function SearchNotFound({ searchQuery = '', ...other }: SearchNotFoundProps) {
  const { translate } = useLocales();
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        {translate('message.not-found')}
      </Typography>
      {searchQuery != '' && (
        <Typography variant="body2" align="center">
          {translate('message.not-found-result')} &nbsp;
          <strong>&quot;{searchQuery}&quot;</strong>. {translate('message.try-check')}
        </Typography>
      )}
    </Paper>
  );
}
