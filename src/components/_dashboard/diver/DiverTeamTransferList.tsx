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
  Radio
} from '@material-ui/core';
import { manageDiver } from '_apis_/diver';
import { getListDiverTeam } from 'redux/slices/diver';
import { Diver, DiverTeam } from '../../../@types/diver';
// utils
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------
const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap'
} as const;

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

type DiverTeaTransferListProps = {
  isEdit: boolean;
  currentDiverTeam?: DiverTeam | null;
  submitRef: any;
  onSubmitCallback: any;
};

export default function DiverTeaTransferList({
  isEdit,
  currentDiverTeam,
  submitRef,
  onSubmitCallback
}: DiverTeaTransferListProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // -------------------
  const diverList = useSelector((state: RootState) => state.diver.diverList);
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
      id: currentDiverTeam?.id || '',
      name: currentDiverTeam?.name || '',
      number: currentDiverTeam?.number || '',
      divers: currentDiverTeam?.divers || [{}],
      status: currentDiverTeam?.status || 1
    },

    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        values.divers = right.map((v: any) => ({
          id: v
        }));
        let flag = false;

        !isEdit
          ? await manageDiver.createDiverTeam(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageDiver.updateDiverTeam(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            });

        if (flag) {
          // setCurrentArea(null);
          setSubmitting(false);
          onSubmitCallback(true);
          dispatch(getListDiverTeam(0, -1));
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
        } else {
          onSubmitCallback(false);
          enqueueSnackbar(
            !isEdit ? translate('message.create-error') : translate('message.create-error'),
            {
              variant: 'error'
            }
          );
        }
      } catch (error) {
        onSubmitCallback(false);
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  useEffect(() => {
    let listSelectDiverTeamId: number[] = [];
    const listSelectedDiverId: number[] = [];
    if (isEdit) {
      currentDiverTeam?.divers.map((v: Diver) => listSelectedDiverId.push(Number(v.id)));
      const mapId: number[] = [];
      diverList.map((v: Diver) => mapId.push(Number(v.id)));
      listSelectDiverTeamId = mapId.filter((i) => !listSelectedDiverId.includes(i));
    } else {
      diverList.map((v: Diver) => listSelectDiverTeamId.push(Number(v.id)));
    }
    setRight(listSelectedDiverId);
    setLeft(listSelectDiverTeamId);
  }, [currentDiverTeam]);

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
          'page.diver-team.form.selected'
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
                <Avatar src={diverList.find((e: Diver) => Number(e.id) == value)?.imageUrl} />
                <ListItemText
                  id={labelId}
                  primary={diverList.find((e: Diver) => Number(e.id) == value)?.name}
                />
              </Stack>
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
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label={translate('page.diver-team.form.name')}
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* <Grid item>
            <TextField
              fullWidth
              label="Search"
              type="search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon={searchFill} />
                  </InputAdornment>
                )
              }}
            />
          </Grid> */}

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
                        <Grid item>
                          {customList(translate('page.diver-team.form.choices'), left)}
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
                          {customList(translate('page.diver-team.form.chosen'), right)}
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
