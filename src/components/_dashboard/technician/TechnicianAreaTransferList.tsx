import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useCallback, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { RootState, useSelector, dispatch } from 'redux/store';
import searchFill from '@iconify/icons-eva/search-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import arrowheadLeftFill from '@iconify/icons-eva/arrowhead-left-fill';
import arrowheadRightFill from '@iconify/icons-eva/arrowhead-right-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { LoadingButton } from '@material-ui/lab';
import { styled } from '@material-ui/core/styles';
import {
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  CardHeader,
  Checkbox,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  Button,
  ListItemText,
  Avatar,
  Radio,
  FormHelperText
} from '@material-ui/core';
import { PATH_DASHBOARD } from 'routes/paths';
import { manageTechnican } from '_apis_/technician';
import { getListDiverTeam } from 'redux/slices/diver';
import { Technician } from '../../../@types/technicians';
import { Area } from '../../../@types/area';
// utils
import useLocales from '../../../hooks/useLocales';
// ----------------------------------------------------------------------

type TechnicianAreaTransferListProps = {
  isEdit: boolean;
  currentTechnician?: Technician;
  areaList: Area[];
  submitRef: any;
  onSubmitCallback: any;
};

export default function TechnicianAreaTransferList({
  isEdit,
  currentTechnician,
  areaList,
  submitRef,
  onSubmitCallback
}: TechnicianAreaTransferListProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // -------------------
  const areaListAll = useSelector((state: RootState) => state.area.areaList);
  const [checked, setChecked] = useState<number[]>([]);
  const [left, setLeft] = useState<number[] | any>([]);
  const [right, setRight] = useState<number[]>([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  // -------------------

  function not(a: number[], b: number[]) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a: number[], b: number[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  function union(a: number[], b: number[]) {
    return [...a, ...not(b, a)];
  }

  const numberOfChecked = (items: number[]) => intersection(checked, items).length;

  const handleToggleAll = (items: number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));

    setRight([]);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentTechnician?.id || '',
      technicianId: currentTechnician?.id || '',
      area: [{}]
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        values.area = right.map((v: any) => ({
          id: v
        }));

        await manageTechnican.updateTechnicanArea(values).then((response) => {
          if (response.status === 200) {
            onSubmitCallback(true);
            navigate(PATH_DASHBOARD.staff.listTechnician);
            enqueueSnackbar(translate('message.update-success'), {
              variant: 'success'
            });
          } else {
            setSubmitting(false);
            onSubmitCallback(false);
            enqueueSnackbar(translate('message.update-error'), {
              variant: 'error'
            });
          }
        });
      } catch (error) {
        onSubmitCallback(false);
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  useEffect(() => {
    setFieldValue('number', right.length);
  }, [right, left]);

  useEffect(() => {
    if (right.length <= 2) {
      onSubmitCallback(false);
    }
  }, [isSubmitting]);

  useEffect(() => {
    let listSelectAreaId: number[] = [];
    const listSelectedAreaId: number[] = [];
    // if (currentTechnician?.areas.length != 0) {
    currentTechnician?.areas.map((v: Area) => listSelectedAreaId.push(Number(v.id)));
    const mapId: number[] = [];
    areaListAll.map((v: Area) => mapId.push(Number(v.id)));
    listSelectAreaId = mapId.filter((i) => !listSelectedAreaId.includes(i));
    // } else {
    //   areaListAll.map((v: Area) => listSelectAreaId.push(Number(v.id)));
    // }
    setRight(listSelectedAreaId);
    setLeft(listSelectAreaId);
  }, [currentTechnician]);

  // define
  const customList = (title: React.ReactNode, items: number[]) => (
    <Card
      sx={{
        width: 300,
        height: 450,
        overflow: 'auto',
        borderRadius: 1.5
      }}
    >
      <CardHeader
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} ${translate(
          'page.diver-team-area.form.selected'
        )}`}
        sx={{ p: 2 }}
      />

      <Divider />
      <List dense component="div" role="list">
        {items.map((value: number) => {
          const labelId = `transfer-list-item-${value}-label`;
          return (
            <ListItemButton key={value} role="listitem" onClick={handleToggle(value)}>
              <ListItemIcon>
                <Radio
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ListItemText
                  id={labelId}
                  primary={areaListAll.find((e: Area) => Number(e.id) == value)?.name}
                />
              </Stack>
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ p: 3, minWidth: 600 }}>
                  <Stack spacing={3}>
                    <Stack
                      direction={{ xs: 'row', sm: 'row' }}
                      spacing={{ xs: 3, sm: 2 }}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        sx={{ width: 'auto', py: 3 }}
                      >
                        <Grid item>{customList(translate('page.area.form.choices'), left)}</Grid>
                        <Grid item>
                          <Grid container direction="column" alignItems="center" sx={{ p: 3 }}>
                            <Button
                              color="inherit"
                              variant="outlined"
                              size="small"
                              onClick={handleAllRight}
                              disabled={left.length === 0}
                              aria-label="move all right"
                              sx={{ my: 1 }}
                            >
                              <Icon icon={arrowheadRightFill} width={18} height={18} />
                            </Button>
                            <Button
                              color="inherit"
                              variant="outlined"
                              size="small"
                              onClick={handleCheckedRight}
                              disabled={leftChecked.length === 0}
                              aria-label="move selected right"
                              sx={{ my: 1 }}
                            >
                              <Icon icon={arrowIosForwardFill} width={18} height={18} />
                            </Button>
                            <Button
                              color="inherit"
                              variant="outlined"
                              size="small"
                              onClick={handleCheckedLeft}
                              disabled={rightChecked.length === 0}
                              aria-label="move selected left"
                              sx={{ my: 1 }}
                            >
                              <Icon icon={arrowIosBackFill} width={18} height={18} />
                            </Button>
                            <Button
                              color="inherit"
                              variant="outlined"
                              size="small"
                              onClick={handleAllLeft}
                              disabled={right.length === 0}
                              aria-label="move all left"
                              sx={{ my: 1 }}
                            >
                              <Icon icon={arrowheadLeftFill} width={18} height={18} />
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid item>
                          {customList(translate('page.area.form.chosen'), right)}
                          {/* <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                            {touched.number && errors.number}
                          </FormHelperText> */}
                        </Grid>
                      </Grid>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Button type="submit" ref={submitRef} disableRipple={true} />
      </Form>
    </FormikProvider>
  );
}
