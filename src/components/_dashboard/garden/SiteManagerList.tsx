import axios from 'axios';
import { filter } from 'lodash';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { manageEmployee } from '_apis_/employee';
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
  CardHeader
} from '@material-ui/core';
import { statusOptions } from 'utils/constants';
import {
  getListEmployeePartner,
  getListEmployeePartnerById,
  getListSiteManagerById
} from 'redux/slices/employee';
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'routes/paths';
import Scrollbar from 'components/Scrollbar';
import Label from 'components/Label';
import SearchNotFound from 'components/SearchNotFound';
import { RootState, useDispatch, useSelector } from 'redux/store';
import useLocales from 'hooks/useLocales';
import useSettings from 'hooks/useSettings';
import {
  SiteManagerListHead,
  SiteManagerListToolbar,
  SiteManagerMoreMenu
} from '../account/list_site_manager';
import { Employee } from '../../../@types/employee';
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

function applySortFilter(array: Employee[], comparator: (a: any, b: any) => number, query: string) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_staff) => _staff.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

type SiteManagerListProps = {
  siteId: string;
};
export default function SiteManagerList({ siteId }: SiteManagerListProps) {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const dispatch = useDispatch();
  const employeeList = useSelector((state: RootState) => state.employee.employeeList);
  const totalCount = useSelector((state: RootState) => state.employee.totalCount);
  const isLoading = useSelector((state: RootState) => state.employee.isLoading);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = employeeList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await manageEmployee.deleteEmployeePartner(id).then((respone) => {
        if (respone.status == 200) {
          enqueueSnackbar(translate('message.delete-success'), { variant: 'success' });
          dispatch(getListEmployeePartner(page, rowsPerPage));
        } else {
          enqueueSnackbar(translate('message.delete-error'), { variant: 'error' });
        }
      });
    } catch (error) {
      enqueueSnackbar(translate('message.delete-error'), { variant: 'error' });
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getListSiteManagerById(siteId, 'SM', page, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const emptyRows = !isLoading && !employeeList;

  const filteredEmployee = applySortFilter(employeeList, getComparator(order, orderBy), filterName);

  const isEmployeeNotFound = filteredEmployee.length === 0 && !isLoading;
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
    { id: 'name', label: translate('page.employee-partner.form.name'), alignRight: false },
    { id: 'phone', label: translate('page.employee-partner.form.phone'), alignRight: false },
    { id: 'email', label: translate('page.employee-partner.form.email'), alignRight: false },
    { id: 'address', label: translate('page.employee-partner.form.address'), alignRight: false },
    { id: 'status', label: translate('page.employee-partner.form.status'), alignRight: false },
    { id: '' }
  ];
  return (
    <Page title={translate('page.employee-partner.title.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 3, sm: 2 }}
            justifyContent="space-between"
          >
            <SiteManagerListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
            <CardHeader
              sx={{ mb: 2 }}
              action={
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.staff.newSite}
                  startIcon={<Icon icon={plusFill} />}
                >
                  {translate('button.save.add')}
                </Button>
              }
            />
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SiteManagerListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={employeeList.length}
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
                    filteredEmployee.map((row) => {
                      const { id, name, phone, status, email, address, imageUrl } = row;
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
                              <Avatar alt={name} src={imageUrl} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{phone}</TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{address}</TableCell>
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
                            <SiteManagerMoreMenu
                              onDelete={() => handleDeleteEmployee(id.toString())}
                              id={id.toString()}
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
                {isEmployeeNotFound && (
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
      </Container>
    </Page>
  );
}
