import axios from 'axios';
import { filter } from 'lodash';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { manageDiver } from '_apis_/diver';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  Box,
  Tab,
  Grid,
  CardHeader
} from '@material-ui/core';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { statusOptions } from 'utils/constants';
import DiverTeamNewForm from 'components/_dashboard/diver/DiverTeamNewForm';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getListDiverTeam } from '../../redux/slices/diver';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// @types
import { DiverTeam } from '../../@types/diver';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  DiverTeamListHead,
  DiverTeamListToolbar,
  DiverTeamMoreMenu
} from '../../components/_dashboard/diver/list_diver_team';
// ----------------------------------------------------------------------

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

function applySortFilter(
  array: DiverTeam[],
  comparator: (a: any, b: any) => number,
  query: string
) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_diver) => _diver.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const dispatch = useDispatch();
  const diverTeamList = useSelector((state: RootState) => state.diver.diverTeamList);
  const totalCount = useSelector((state: RootState) => state.diver.totalCountDiverTeam);
  const isLoading = useSelector((state: RootState) => state.diver.isLoadingDiverTeam);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [valueTab, setValueTab] = useState('0');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentDiverTeamId, setCurrentDiverTeamId] = useState<string | null>(null);
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = diverTeamList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleDeleteDiverTeam = async (id: string) => {
    try {
      await manageDiver.deleteDiverTeam(id).then((respone) => {
        if (respone.status == 200) {
          dispatch(getListDiverTeam(page, rowsPerPage));
          enqueueSnackbar(translate('message.delete-success'), { variant: 'success' });
        } else {
          enqueueSnackbar(translate('message.delete-error'), { variant: 'error' });
        }
      });
    } catch (error) {
      enqueueSnackbar(translate('message.delete-success'), { variant: 'success' });
      console.log(error);
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };

  const handleClickEditOpen = async (id: string) => {
    setOpen(true);
    setCurrentDiverTeamId(id);
    setIsEdit(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setCurrentDiverTeamId(null);
    setOpen(true);
    setIsEdit(false);
  };

  useEffect(() => {
    dispatch(getListDiverTeam(page, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const emptyRows = !isLoading && !diverTeamList;

  const filteredDiverTeam = applySortFilter(
    diverTeamList,
    getComparator(order, orderBy),
    filterName
  );

  const isDiverTeamNotFound = filteredDiverTeam.length === 0 && !isLoading;
  // if (companiesList !== null) {
  //   companiesList.map((item, index) => {
  //     return (
  //       <div key={index}>
  //         <h1>{item[index]}</h1>
  //       </div>
  //     );
  //   });
  // }
  const TABLE_HEAD = [
    { id: 'name', label: translate('page.diver-team.form.name'), alignRight: false },
    { id: 'quantity', label: translate('page.diver-team.form.quantity'), alignRight: false },
    { id: 'status', label: translate('page.diver-team.form.status'), alignRight: false },
    { id: '' }
  ];
  return (
    <Page title={translate('page.diver-team.title.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('page.diver-team.heading1.list')}
          links={[
            { name: translate('page.diver-team.heading2'), href: PATH_DASHBOARD.root },
            { name: translate('page.diver-team.heading3'), href: PATH_DASHBOARD.staff.team },
            { name: translate('page.diver-team.heading4.list') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.staff.teamNew}
              startIcon={<Icon icon={plusFill} />}
            >
              {/* <Button
              variant="contained"
              onClick={handleClickOpen}
              startIcon={<Icon icon={plusFill} />}
            > */}
              {translate('button.save.add')}
            </Button>
          }
        />
        <Card>
          <DiverTeamListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DiverTeamListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={diverTeamList.length}
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
                    filteredDiverTeam.map((row) => {
                      const { id, name, number, status } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            {/* <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} /> */}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{number}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={(status === 0 && 'error') || 'success'}
                            >
                              {translate(
                                `status.${statusOptions.find((v: any) => v.id == status)?.label}`
                              )}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <DiverTeamMoreMenu
                              onDelete={() => handleDeleteDiverTeam(id.toString())}
                              userName={id.toString()}
                              status={status}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}

                  {emptyRows && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                        <Typography gutterBottom align="center" variant="subtitle1">
                          {translate('message.not-found')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {isDiverTeamNotFound && (
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

        <DiverTeamNewForm
          id={currentDiverTeamId}
          open={open}
          onClose={handleClose}
          isEdit={isEdit}
        />
      </Container>
    </Page>
  );
}
