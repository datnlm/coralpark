import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { filter } from 'lodash';
import { useCallback, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { Form, FormikProvider, useFormik } from 'formik';
import { RootState, useSelector, dispatch } from 'redux/store';
import searchFill from '@iconify/icons-eva/search-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
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
  Box,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  CircularProgress,
  TableRow,
  TablePagination,
  Autocomplete
} from '@material-ui/core';
import { PATH_DASHBOARD } from 'routes/paths';
import { manageDiver } from '_apis_/diver';
import { getListDiverTeam } from 'redux/slices/diver';
import Scrollbar from 'components/Scrollbar';
import SearchNotFound from 'components/SearchNotFound';
import { OptionStatus, statusOptions } from 'utils/constants';
import { Area } from '../../../@types/area';
import { Diver, DiverTeam } from '../../../@types/diver';
// utils
import useLocales from '../../../hooks/useLocales';
import { AreaListHead, AreaListToolbar, AreaMoreMenu } from '../area/list';
import DiverTeamAreaNewForm from './DiverTeamAreaNewForm';

// ----------------------------------------------------------------------
type DiverTeamNewFormProps = {
  isEdit: boolean;
  currentDiverTeam?: DiverTeam;
};

type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array: Area[], comparator: (a: any, b: any) => number, query: string) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_garden) => _garden.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function DiverTeaTransferList({ isEdit, currentDiverTeam }: DiverTeamNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // -------------------
  const diverList = useSelector((state: RootState) => state.diver.diverList);
  const [checked, setChecked] = useState<number[]>([]);
  const [left, setLeft] = useState<number[] | any>([]);
  const [right, setRight] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [areaList, setAreaList] = useState<Area[]>([]);
  const areaList2 = useSelector((state: RootState) => state.area.areaList);
  const isLoading = useSelector((state: RootState) => state.area.isLoading);
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
  const NewProductSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate('message.form.name'))
      .min(3, translate('message.form.name_length_50'))
      .max(50, translate('message.form.name_length_50')),
    number: Yup.number().min(2, translate('message.form.number_2'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentDiverTeam?.id || '',
      name: currentDiverTeam?.name || '',
      number: Number(currentDiverTeam?.number) || 0,
      divers: currentDiverTeam?.divers || [{}],
      areas: currentDiverTeam?.areas || [],
      status: currentDiverTeam?.status || 1
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        values.divers = right.map((v: any) => ({
          id: v
        }));
        let flag = false;
        if (isEdit) {
          values.status = enumStatus!.id;
        }
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
          navigate(PATH_DASHBOARD.staff.team);
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
        } else {
          setSubmitting(false);
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

  useEffect(() => {
    setFieldValue('number', right.length);
  }, [right, left]);

  // useEffect(() => {
  //   if (right.length <= 2) {
  //     onSubmitCallback(false);
  //   }
  // }, [isSubmitting]);

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
    setEnumStatus(statusOptions.find((v) => v.id == currentDiverTeam?.status) || null);
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
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = areaList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const emptyRows = !isLoading && !areaList;
  const filteredArea = applySortFilter(
    currentDiverTeam?.areas ?? [],
    getComparator(order, orderBy),
    filterName
  );
  const isAreaNotFound = filteredArea.length === 0 && !isLoading;

  const TABLE_HEAD = [
    { id: 'name', label: translate('page.area.form.name'), alignRight: false },
    { id: 'address', label: translate('page.area.form.address'), alignRight: false },
    { id: '' }
  ];

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label={translate('page.diver-team.form.name')}
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                    {isEdit && (
                      <Autocomplete
                        fullWidth
                        disablePortal
                        clearIcon
                        id="status"
                        value={enumStatus}
                        options={statusOptions}
                        getOptionLabel={(option: OptionStatus) =>
                          translate(`status.${option.label}`)
                        }
                        // getOptionLabel={(option: any) => (option ? option.name : '')}
                        onChange={(e, values: OptionStatus | null) => setEnumStatus(values)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={translate('page.garden.form.status')}
                            error={Boolean(touched.status && errors.status)}
                            helperText={touched.status && errors.status}
                          />
                        )}
                      />
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
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
                          <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                            {touched.number && errors.number}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? translate('button.save.add') : translate('button.save.update')}
          </LoadingButton>
        </Box>

        <Grid item xs={12} md={12} spacing={3} padding={{ t: 3 }}>
          <Card>
            <Accordion key="1" disabled={!isEdit}>
              <AccordionSummary
                expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
              >
                <Typography variant="subtitle1">{translate('page.area.heading1.list')}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Card>
                  <Stack
                    direction={{ xs: 'row', sm: 'row' }}
                    spacing={{ xs: 3, sm: 2 }}
                    justifyContent="space-between"
                  >
                    <AreaListToolbar
                      numSelected={selected.length}
                      filterName={filterName}
                      onFilterName={handleFilterByName}
                    />
                    <CardHeader
                      sx={{ mb: 2 }}
                      action={
                        <Button
                          size="small"
                          onClick={handleClickOpen}
                          startIcon={<Icon icon={plusFill} />}
                        >
                          {translate('button.save.change')}
                        </Button>
                      }
                    />
                  </Stack>
                  <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                      <Table>
                        <AreaListHead
                          order={order}
                          orderBy={orderBy}
                          headLabel={TABLE_HEAD}
                          rowCount={currentDiverTeam?.areas.length ?? 0}
                          numSelected={selected.length}
                          onRequestSort={handleRequestSort}
                          onSelectAllClick={handleSelectAllClick}
                        />
                        <TableBody>
                          {isLoading ? (
                            <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                              <CircularProgress />
                            </TableCell>
                          ) : (
                            filteredArea
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((row, index) => {
                                const { id, name, address } = row;

                                const isItemSelected = selected.indexOf(id) !== -1;

                                return (
                                  <TableRow hover key={id} tabIndex={-1} role="checkbox">
                                    <TableCell padding="checkbox">
                                      {/* <Checkbox checked={isItemSelected} /> */}
                                    </TableCell>
                                    <TableCell align="left">{name}</TableCell>
                                    <TableCell align="left">{address}</TableCell>
                                    <TableCell align="right">
                                      <AreaMoreMenu onDelete={() => {}} areaId={id.toString()} />
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                          )}
                          {emptyRows && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                              <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                <Typography gutterBottom align="center" variant="subtitle1">
                                  {translate('message.not-found')}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        {isAreaNotFound && (
                          <TableBody>
                            <TableRow>
                              <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                <SearchNotFound searchQuery={filterName} />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        )}
                      </Table>
                    </TableContainer>
                  </Scrollbar>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: translate('message.all'), value: -1 }]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, page) => setPage(page)}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Card>
              </AccordionDetails>
            </Accordion>
          </Card>
        </Grid>
      </Form>
      <DiverTeamAreaNewForm
        currentDiverTeam={currentDiverTeam}
        areaList={areaList}
        open={open}
        onClose={handleClose}
        isEdit={isEdit}
      />
    </FormikProvider>
  );
}
