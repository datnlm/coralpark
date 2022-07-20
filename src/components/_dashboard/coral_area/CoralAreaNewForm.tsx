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
import { LoadingButton } from '@material-ui/lab';
import { dispatch } from 'redux/store';
import { getListGarden } from 'redux/slices/garden';
import useLocales from '../../../hooks/useLocales';
import { Technician } from '../../../@types/technicians';
import { Area } from '../../../@types/area';
import CoralAreaTransferList from './CoralAreaTransferList';
import { Coral } from '../../../@types/coral';
// ----------------------------------------------------------------------

type CoralAreaNewFormProps = {
  currentCoral?: Coral;
  areaList: Area[];
  isEdit: boolean;
  open: boolean;
  onClose: VoidFunction;
};

export default function CoralAreaNewForm({
  currentCoral,
  areaList,
  open,
  onClose,
  isEdit
}: CoralAreaNewFormProps) {
  const { translate } = useLocales();
  // -------------------
  const submitRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getListGarden(0, -1));
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
      <DialogTitle> {translate('page.area.heading1.list')}</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <CoralAreaTransferList
                  isEdit={isEdit}
                  currentCoral={currentCoral}
                  areaList={areaList}
                  submitRef={submitRef}
                  onSubmitCallback={callback}
                />
              </Grid>
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
