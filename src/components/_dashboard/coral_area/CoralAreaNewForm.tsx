import * as Yup from 'yup';
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
  Switch,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  Select,
  FormHelperText,
  FormControlLabel,
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
import { manageCoral } from '_apis_/coral';
import { manageArea } from '_apis_/area';
import { Area } from '../../../@types/area';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import useLocales from '../../../hooks/useLocales';
// @types
import { Coral, CoralArea } from '../../../@types/coral';

//

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

type CoralAreaNewFormProps = {
  currentCoralArea?: CoralArea;
};

export default function CoralAreaNewForm({ currentCoralArea }: CoralAreaNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // -------------------
  const [currentArea, setCurrentArea] = useState<any>(null);
  const [optionsArea, setOptionsArea] = useState<Area[]>([]);
  const [coralList, setCoralList] = useState<Coral[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [left, setLeft] = useState<number[] | any>([]);
  const [right, setRight] = useState<number[]>([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const [isEdit, setIsEdit] = useState<Boolean>(false);
  // -------------------
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required')
  });

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
      coral: currentArea?.coral || '',
      area: currentArea?.area || ''
    },
    // validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        // number.map((v) => arr.push({id: v}));
        values.coral = right.map((v: any) => ({
          id: v
        }));
        values.area = currentArea;

        let flag = false;

        !isEdit
          ? await manageCoral.createCoralArea(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await manageCoral.updateCoralArea(values).then((response) => {
              if (response.status == 200) {
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

  // fetch list coral
  useEffect(() => {
    manageArea.getListArea(1, 10000).then((response) => {
      if (response.status == 200) {
        setOptionsArea(response.data.items);
      } else {
        setOptionsArea([]);
      }
    });
  }, []);

  useEffect(() => {
    const mapCoralAreaId: number[] = [];
    setRight([]);
    setLeft([]);
    setIsEdit(false);
    if (currentArea != null) {
      // set coral id right
      manageArea.getAreaById(currentArea.id).then((response) => {
        if (response.status == 200) {
          const data = response.data.corals;
          if (data != null) {
            data.map((v: Coral) => mapCoralAreaId.push(Number(v.id)));
            setRight(mapCoralAreaId);
            setIsEdit(true);
          }
          // set coral id left
          manageCoral.getListCoral(1, 100000).then((response) => {
            if (response.status == 200) {
              const data = response.data.items;
              setCoralList(data);
              const mapId: number[] = [];
              data.map((v: Coral) => mapId.push(Number(v.id)));
              console.log('mapId');
              console.log(mapId);
              const mapCoralId: number[] = mapId.filter((i) => !mapCoralAreaId.includes(i));
              console.log('mapCoralId');
              console.log(mapCoralId);
              setLeft(mapCoralId);
            }
          });
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
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
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
                primary={coralList.find((e: Coral) => Number(e.id) == value)?.name}
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
                    options={optionsArea}
                    getOptionLabel={(option: Area) => option.name}
                    onChange={(e, values: Area | null) => setCurrentArea(values)}
                    renderInput={(params) => (
                      <TextField {...params} label={translate('page.coral-area.form.area')} />
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
                    <Grid item>{customList(translate('page.coral-area.form.choices'), left)}</Grid>
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
                    <Grid item>{customList(translate('page.coral-area.form.chosen'), right)}</Grid>
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
