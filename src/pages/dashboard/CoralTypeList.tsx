import axios from 'axios';
import { filter, orderBy } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { manageCoral } from '_apis_/coral';
// material
import { useTheme, styled } from '@material-ui/core/styles';

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
  TablePagination
} from '@material-ui/core';
import CoralTypeSort from 'components/_dashboard/coral/CoralTypeSort';
import { coralLevelType } from 'utils/constants';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import {
  getUserList,
  deleteUser,
  getAreaProvice,
  getListCoral,
  getListCoralType
} from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// @types
import { CoralType } from '../../@types/user';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  CoralTypeListHead,
  CoralTypeListToolbar,
  CoralTypeMoreMenu
} from '../../components/_dashboard/coral/list_type';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Type Name', alignRight: false },
  { id: 'role', label: 'Level Type', alignRight: false },
  { id: '' }
];

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

export default function UserList() {
  const { themeStretch } = useSettings();
  // 1 - class
  const [filters, setFilters] = useState('1');
  const theme = useTheme();
  const dispatch = useDispatch();
  const coralTypeList = useSelector((state: RootState) => state.user.coralListType);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expanded, setExpanded] = useState<string | false>('panel1');

  useEffect(() => {
    dispatch(getListCoralType());
  }, [dispatch]);

  const handleChangeSort = (value?: string) => {
    if (value) {
      setFilters(value);
    }
  };

  function applySortFilterCoral(
    array: CoralType[],
    comparator: (a: any, b: any) => number,
    query: string,
    sort: string
  ) {
    const stabilizedThis = array.map((el, index) => [el, index] as const);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(
        array,
        (_coral) =>
          _coral.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 && _coral.levelType == sort
      );
    }
    if (sort) {
      return filter(array, (_coral) => _coral.levelType == sort);
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = coralTypeList.map((n) => n.name);
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

  // const handleDeleteUser = (userId: string) => {
  //   dispatch(deleteUser(userId));
  // };

  const handleDeleteCoralType = async (coralId: string) => {
    try {
      await manageCoral.deleteCoralType(coralId).then((respone) => {
        if (respone.status === 200) {
          dispatch(getListCoralType());
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - coralTypeList.length) : 0;

  const filteredCoralsType = applySortFilterCoral(
    coralTypeList,
    getComparator(order, orderBy),
    filterName,
    filters
  );
  // const sortCoralsType = applySort(coralTypeList, getComparator(order, orderBy), filters);

  const isCoralTypeNotFound = filteredCoralsType.length === 0;
  // if (companiesList !== null) {
  //   companiesList.map((item, index) => {
  //     return (
  //       <div key={index}>
  //         <h1>{item[index]}</h1>
  //       </div>
  //     );
  //   });
  // }

  return (
    <Page title="Coral Type: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Coral Type list"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Coral Type', href: PATH_DASHBOARD.coral.listType },
            { name: 'List' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.coral.type}
              startIcon={<Icon icon={plusFill} />}
            >
              New Coral Type
            </Button>
          }
        />
        <Card>
          <Stack direction="row" alignItems="left">
            {/* <Stack mb={5} direction="row" alignItems="left"> */}
            <CoralTypeSort query={filters} options={coralLevelType} onSort={handleChangeSort} />
            <CoralTypeListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CoralTypeListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={coralTypeList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCoralsType
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, parentId, levelType, parents, description } = row;
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
                          <TableCell align="left">
                            {coralLevelType.find((e: any) => e.id == levelType)?.label}
                          </TableCell>
                          <TableCell align="right">
                            <CoralTypeMoreMenu
                              onDelete={() => handleDeleteCoralType(id)}
                              coralTypeId={id.toString()}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isCoralTypeNotFound && (
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={coralTypeList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
