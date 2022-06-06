import { filter } from 'lodash';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Link as RouterLink } from 'react-router-dom';
import { manageGroupMode } from '_apis_/group-mode';
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
import axiosInstance from 'utils/axios';
import axios from 'axios';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getListGroupMode } from '../../redux/slices/groupMode';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// @types
import { GroupMode } from '../../@types/group-mode';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  GroupModeListHead,
  GroupModeListToolbar,
  GroupModeMoreMenu
} from '../../components/_dashboard/group-mode/list';
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
  array: GroupMode[],
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

export default function EcommerceProductList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const groupModeList = useSelector((state: RootState) => state.groupMode.groupModeList);
  const totalCount = useSelector((state: RootState) => state.groupMode.totalCount);
  const isLoading = useSelector((state: RootState) => state.groupMode.isLoading);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');

  useEffect(() => {
    dispatch(getListGroupMode(page, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const selected = groupModeList.map((n) => n.name);
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

  const handleDeleteGroup = async (id: string) => {
    try {
      await manageGroupMode.deleteGroupMode(id).then((respone) => {
        if (respone.status == 200) {
          enqueueSnackbar('Delete success', { variant: 'success' });
          dispatch(getListGroupMode(page, rowsPerPage));
        } else {
          enqueueSnackbar('Delete error', { variant: 'error' });
        }
      });
    } catch (error) {
      enqueueSnackbar('Delete error', { variant: 'error' });
      console.log(error);
    }
  };

  const emptyRows = !isLoading && !groupModeList;

  const filteredGroupMode = applySortFilter(
    groupModeList,
    getComparator(order, orderBy),
    filterName
  );

  const isGroupModeNotFound = filteredGroupMode.length === 0 && !isLoading;

  const TABLE_HEAD = [
    { id: 'name', label: translate('page.group-mode.form.name'), alignRight: false },
    {
      id: 'contribution',
      label: translate('page.group-mode.form.contribution'),
      alignRight: false
    },
    { id: '' }
  ];

  return (
    <Page title={translate('page.group-mode.title.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('page.group-mode.heading1.list')}
          links={[
            { name: translate('page.group-mode.heading2'), href: PATH_DASHBOARD.root },
            {
              name: translate('page.group-mode.heading3'),
              href: PATH_DASHBOARD.group.root
            },
            { name: translate('page.group-mode.heading4.list') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.group.newGroupMode}
              startIcon={<Icon icon={plusFill} />}
            >
              {translate('button.save.add')}
            </Button>
          }
        />

        <Card>
          <GroupModeListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <GroupModeListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={groupModeList.length}
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
                    filteredGroupMode.map((row, index) => {
                      const { id, name, contribute } = row;

                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox">
                          <TableCell padding="checkbox">
                            {/* <Checkbox checked={isItemSelected} /> */}
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{contribute}</TableCell>
                          <TableCell align="right">
                            <GroupModeMoreMenu
                              onDelete={() => handleDeleteGroup(id.toString())}
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
                {isGroupModeNotFound && (
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
