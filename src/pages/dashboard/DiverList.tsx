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
  CircularProgress
} from '@material-ui/core';
import { statusOptions } from 'utils/constants';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getListDiver } from '../../redux/slices/diver';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// @types
import { Diver } from '../../@types/diver';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  DiverListHead,
  DiverListToolbar,
  DiverMoreMenu
} from '../../components/_dashboard/diver/list';
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

function applySortFilter(array: Diver[], comparator: (a: any, b: any) => number, query: string) {
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
  const diverList = useSelector((state: RootState) => state.diver.diverList);
  const totalCount = useSelector((state: RootState) => state.diver.totalCount);
  const isLoading = useSelector((state: RootState) => state.diver.isLoading);
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
      const newSelecteds = diverList.map((n) => n.name);
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

  const handleDeleteDiver = async (id: string) => {
    try {
      await manageDiver.deleteDiver(id).then((respone) => {
        if (respone.status == 200) {
          enqueueSnackbar(translate('message.delete-success'), { variant: 'success' });
          dispatch(getListDiver(page, rowsPerPage));
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
    dispatch(getListDiver(page, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const emptyRows = !isLoading && !diverList;

  const filteredDiver = applySortFilter(diverList, getComparator(order, orderBy), filterName);

  const isDiverNotFound = filteredDiver.length === 0 && !isLoading;
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
    { id: 'name', label: translate('page.diver.form.name'), alignRight: false },
    { id: 'phone', label: translate('page.diver.form.phone'), alignRight: false },
    { id: 'email', label: translate('page.diver.form.email'), alignRight: false },
    { id: 'address', label: translate('page.diver.form.address'), alignRight: false },
    { id: 'status', label: translate('page.diver.form.status'), alignRight: false },
    { id: '' }
  ];
  return (
    <Page title={translate('page.diver.title.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('page.diver.heading1.list')}
          links={[
            { name: translate('page.diver.heading2'), href: PATH_DASHBOARD.root },
            { name: translate('page.diver.heading3'), href: PATH_DASHBOARD.diver.root },
            { name: translate('page.diver.heading4.list') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.diver.newDiver}
              startIcon={<Icon icon={plusFill} />}
            >
              {translate('button.save.add')}
            </Button>
          }
        />
        <Card>
          <DiverListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DiverListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={diverList.length}
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
                    filteredDiver.map((row) => {
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
                            <DiverMoreMenu
                              onDelete={() => handleDeleteDiver(id.toString())}
                              diverID={id.toString()}
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
                {isDiverNotFound && (
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
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
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
