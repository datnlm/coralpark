import { Icon } from '@iconify/react';
import { useCallback, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import { styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  CardHeader,
  Checkbox,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  Button,
  ListItemText
} from '@material-ui/core';

// utils
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import arrowheadLeftFill from '@iconify/icons-eva/arrowhead-left-fill';
import arrowheadRightFill from '@iconify/icons-eva/arrowhead-right-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import { RootState, useSelector, useDispatch } from 'redux/store';
import { manageArea } from '_apis_/area';
import { manageDiver } from '_apis_/diver';
import { Area } from '../../../@types/area';
import useLocales from '../../../hooks/useLocales';
// @types
import { DiverTeam } from '../../../@types/diver';
// redux
import { getListDiverTeam } from '../../../redux/slices/diver';

// ----------------------------------------------------------------------

export default function CoralAreaNewForm() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  // -------------------
  const diverTeamList = useSelector((state: RootState) => state.diver.diverTeamList);
  const areaList = useSelector((state: RootState) => state.area.areaList);
  const [currentArea, setCurrentArea] = useState<any>(null);
  const [checked, setChecked] = useState<number[]>([]);
  const [left, setLeft] = useState<number[] | any>([]);
  const [right, setRight] = useState<number[]>([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const [isEdit, setIsEdit] = useState<Boolean>(false);
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
      id: currentArea?.id || '',
      diverTeams: currentArea?.diverTeams || '',
      area: currentArea?.area || ''
    },
    // validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // number.map((v) => arr.push({id: v}));
        values.diverTeams = right.map((v: any) => ({
          id: v
        }));
        values.area = currentArea;

        let flag = false;

        !isEdit
          ? await manageDiver.createDiverTeamArea(values).then((response) => {
              if (response.status === 200) {
                flag = true;
              }
            })
          : await manageDiver.updateDiverTeamArea(values).then((response) => {
              if (response.status === 200) {
                flag = true;
              }
            });
        if (flag) {
          setCurrentArea(null);
          setSubmitting(false);
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
        } else {
          enqueueSnackbar(
            !isEdit ? translate('message.create-error') : translate('message.create-error'),
            {
              variant: 'error'
            }
          );
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { handleSubmit, isSubmitting, setFieldValue } = formik;

  useEffect(() => {
    dispatch(getListDiverTeam(0, -1));
    setRight([]);
    setLeft([]);
    setIsEdit(false);
    if (currentArea != null) {
      // set coral id right
      manageArea.getAreaById(currentArea.id).then((response) => {
        if (response.status == 200) {
          const data = response.data.diverTeams;
          let listSelectDiverTeamId: number[] = [];
          const listSelectedDiverId: number[] = [];
          if (data != null) {
            setIsEdit(true);
            data.map((v: DiverTeam) => listSelectedDiverId.push(Number(v.id)));
            const mapId: number[] = [];
            diverTeamList.map((v: DiverTeam) => mapId.push(Number(v.id)));
            listSelectDiverTeamId = mapId.filter((i) => !listSelectedDiverId.includes(i));
          } else {
            diverTeamList.map((v: DiverTeam) => listSelectDiverTeamId.push(Number(v.id)));
          }
          setLeft(listSelectDiverTeamId);
          setRight(listSelectedDiverId);
        }
      });
    }
  }, [currentArea]);

  // define
  const customList = (title: React.ReactNode, items: number[]) => (
    <Card
      sx={{
        width: 200,
        height: 520,
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
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={diverTeamList.find((e: DiverTeam) => Number(e.id) == value)?.name}
              />
              {/* <ListItemText
                id={labelId}
                primary={.find((e: any) => e.id == statusEnum)?.label}
              /> */}
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, minWidth: 400 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="area"
                    value={currentArea}
                    options={areaList}
                    getOptionLabel={(option: Area) => option.name}
                    onChange={(e, values: Area | null) => setCurrentArea(values)}
                    renderInput={(params) => (
                      <TextField {...params} label={translate('page.diver-team-area.form.area')} />
                    )}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: 'auto', py: 3 }}
                  >
                    <Grid item>
                      {customList(translate('page.diver-team-area.form.choices'), left)}
                    </Grid>
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
                      {customList(translate('page.diver-team-area.form.chosen'), right)}
                    </Grid>
                  </Grid>
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? translate('button.save.add') : translate('button.save.update')}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
