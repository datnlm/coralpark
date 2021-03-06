import { useRef, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// material
import {
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@material-ui/core';
import { getListDiver } from 'redux/slices/diver';
import { LoadingButton } from '@material-ui/lab';
import { dispatch } from 'redux/store';
import { manageDiver } from '_apis_/diver';
import useLocales from '../../../hooks/useLocales';
import { DiverTeam } from '../../../@types/diver';
import DiverTeamTransferList from './DiverTeamTransferList';
// ----------------------------------------------------------------------

type DiverTeamNewFormProps = {
  id?: string | null;
  isEdit: boolean;
  open: boolean;
  onClose: VoidFunction;
};

export default function DiverTeamNewForm({ id, open, onClose, isEdit }: DiverTeamNewFormProps) {
  const { translate } = useLocales();
  // -------------------
  const submitRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentDiverTeam, setCurrentDiverTeam] = useState<DiverTeam | null>();

  const fetchData = async () => {
    if (id != null) {
      await manageDiver.getDiverTeamByID(id).then((response) => {
        if (response.status === 200) {
          const data = {
            id: response.data.id,
            name: response.data.name,
            number: response.data.number,
            divers: response.data.divers,
            areas: response.data.areas,
            status: response.data.status
          };
          setCurrentDiverTeam(data);
        }
      });
    }
  };

  useEffect(() => {
    if (id != null) {
      fetchData();
    }
    if (id == null) {
      setCurrentDiverTeam(null);
    }
    dispatch(getListDiver(0, -1));
  }, [open]);

  const handleSubmit = () => {
    if (submitRef && submitRef.current) {
      submitRef.current?.click();
      setIsSubmitting(true);
    }
  };
  const callback = async (params: boolean) => {
    if (!params) {
      setIsSubmitting(false);
    } else if (params) {
      onClose();
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{translate('page.diver-team.heading3')}</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={12}>
                <DiverTeamTransferList isEdit={isEdit} currentDiverTeam={currentDiverTeam} />
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <LoadingButton
          type="button"
          variant="contained"
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          {translate('button.save.confirm')}
        </LoadingButton>
        <Button type="button" color="inherit" variant="outlined" onClick={onClose}>
          {translate('button.save.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
