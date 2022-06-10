import { filter } from 'lodash';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Link as RouterLink } from 'react-router-dom';
import { manageGroup } from '_apis_/group';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  Button,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress
} from '@material-ui/core';

import plusFill from '@iconify/icons-eva/plus-fill';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getListGroupRole } from '../../redux/slices/groupMode';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// @types
import { GroupRole } from '../../@types/group';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  GroupRoleListHead,
  GroupRoleListToolbar,
  GroupRoleMoreMenu
} from '../../components/_dashboard/group/list_role';
// ----------------------------------------------------------------------

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Anonymous = Record<string | number, string>;

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(
  array: GroupRole[],
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
    return filter(
      array,
      (_groupMode) => _groupMode.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function GroupRoleList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const groupRoleList = useSelector((state: RootState) => state.groupMode.groupRoleList);
  const totalCount = useSelector((state: RootState) => state.groupMode.totalCount);
  const isLoading = useSelector((state: RootState) => state.groupMode.isLoading);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');

  useEffect(() => {
    dispatch(getListGroupRole(page, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const selected = groupRoleList.map((n) => n.name);
      setSelected(selected);
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

  const handleDeleteGroupRole = async (id: string) => {
    try {
      await manageGroup.deleteGroupRole(id).then((respone) => {
        if (respone.status == 200) {
          enqueueSnackbar(translate('message.delete-success'), { variant: 'success' });
          dispatch(getListGroupRole(page, rowsPerPage));
        } else {
          enqueueSnackbar(translate('message.delete-error'), { variant: 'error' });
        }
      });
    } catch (error) {
      enqueueSnackbar(translate('message.delete-error'), { variant: 'error' });
      console.log(error);
    }
  };

  const emptyRows = !isLoading && !groupRoleList;

  const filteredGroupRole = applySortFilter(
    groupRoleList,
    getComparator(order, orderBy),
    filterName
  );

  const isGroupRoleNotFound = filteredGroupRole.length === 0 && !isLoading;

  const TABLE_HEAD = [
    { id: 'name', label: translate('page.group-role.form.name'), alignRight: false },
    {
      id: 'personalRate',
      label: translate('page.group-role.form.personalRate'),
      alignRight: false
    },
    {
      id: 'partnerRate',
      label: translate('page.group-role.form.partnerRate'),
      alignRight: false
    },
    { id: '' }
  ];

  return (
    <Page title={translate('page.group-role.title.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('page.group-role.heading1.list')}
          links={[
            { name: translate('page.group-role.heading2'), href: PATH_DASHBOARD.root },
            {
              name: translate('page.group-role.heading3'),
              href: PATH_DASHBOARD.group.root
            },
            { name: translate('page.group-role.heading4.list') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.group.newGroupRole}
              startIcon={<Icon icon={plusFill} />}
            >
              {translate('button.save.add')}
            </Button>
          }
        />

        <Card>
          <GroupRoleListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <GroupRoleListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={groupRoleList.length}
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
                    filteredGroupRole.map((row, index) => {
                      const { id, name, personalRate, partnerRate } = row;

                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox">
                          <TableCell padding="checkbox">
                            {/* <Checkbox checked={isItemSelected} /> */}
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{personalRate}</TableCell>
                          <TableCell align="left">{partnerRate}</TableCell>
                          <TableCell align="right">
                            <GroupRoleMoreMenu
                              onDelete={() => handleDeleteGroupRole(id.toString())}
                              id={id.toString()}
                            />
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
                {isGroupRoleNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
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
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
