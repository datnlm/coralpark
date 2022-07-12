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
import { manageDiver } from '_apis_/diver';
import { getListDiverTeam } from 'redux/slices/diver';
import { Site, Garden } from '../../../@types/garden';
// utils
import useLocales from '../../../hooks/useLocales';
// ----------------------------------------------------------------------

type GardenSiteTransferListProps = {
  isEdit: boolean;
  currentSite?: Site;
  submitRef: any;
  onSubmitCallback: any;
};

export default function GardenSiteTransferList({
  isEdit,
  currentSite,
  submitRef,
  onSubmitCallback
}: GardenSiteTransferListProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // -------------------
  const gardenListOutSite = useSelector((state: RootState) => state.garden.gardenList);
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
  const NewGardenSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50')),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, translate('message.form.phone_typeError'))
      .min(10, translate('message.form.phone_length'))
      .max(10, translate('message.form.phone_length'))
      .required(translate('message.form.phone')),
    latitude: Yup.string().required(translate('message.form.latitude')),
    longitude: Yup.string().required(translate('message.form.longitude')),
    address: Yup.string().required(translate('message.form.address')),
    webUrl: Yup.string().matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      translate('message.form.web_typeError')
    ),
    email: Yup.string()
      .email(translate('message.form.email_invalid'))
      .required(translate('message.form.email'))
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentSite?.id || '',
      name: currentSite?.name || '',
      imageUrl: currentSite?.imageUrl || '',
      createTime: currentSite?.createTime || '',
      phone: currentSite?.phone || '',
      email: currentSite?.email || '',
      address: currentSite?.address || '',
      webUrl: currentSite?.webUrl || '',
      latitude: currentSite?.latitude || '',
      longitude: currentSite?.longitude || '',
      status: currentSite?.status || '',
      listGarden: currentSite?.listGarden || ''
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        values.listGarden = right.map((v: any) => ({
          id: v
        }));
        let flag = false;

        !isEdit
          ? await manageDiver.createDiverTeam(values).then((response) => {
              if (response.status === 200) {
                flag = true;
              }
            })
          : await manageDiver.updateDiverTeam(values).then((response) => {
              if (response.status === 200) {
                flag = true;
              }
            });

        if (flag) {
          // setCurrentArea(null);
          onSubmitCallback(true);
          dispatch(getListDiverTeam(0, 5));
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
        } else {
          setSubmitting(false);
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

  useEffect(() => {
    setFieldValue('number', right.length);
  }, [right, left]);

  useEffect(() => {
    if (right.length <= 2) {
      onSubmitCallback(false);
    }
  }, [isSubmitting]);

  useEffect(() => {
    let listSelectGardenId: number[] = [];
    const listSelectedGardenId: number[] = [];
    if (isEdit) {
      currentSite?.listGarden.map((v: Garden) => listSelectedGardenId.push(Number(v.id)));
      const mapId: number[] = [];
      gardenListOutSite.map((v: Garden) => mapId.push(Number(v.id)));
      listSelectGardenId = mapId.filter((i) => !listSelectedGardenId.includes(i));
    } else {
      gardenListOutSite.map((v: Garden) => listSelectGardenId.push(Number(v.id)));
    }
    setRight(listSelectedGardenId);
    setLeft(listSelectGardenId);
  }, [currentSite]);

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
          'page.garden-team.form.selected'
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
                  primary={gardenListOutSite.find((e: Garden) => Number(e.id) == value)?.name}
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
                        <Grid item>{customList(translate('page.garden.form.choices'), left)}</Grid>
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
                          {customList(translate('page.garden.form.chosen'), right)}
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
