import * as React from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useTheme, styled } from '@material-ui/core/styles';
import {
  Box,
  Collapse,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  Stack,
  Container,
  TablePagination
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useState, useEffect } from 'react';
import { manageCoral } from '_apis_/coral';
import Page from '../../components/Page';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import useSettings from '../../hooks/useSettings';
import {
  CoralAreaListHead,
  CoralAreaListToolbar,
  CoralAreaMoreMenu
} from '../../components/_dashboard/coral_area/list';
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getListArea } from '../../redux/slices/area';
import { Area } from '../../@types/area';

const TABLE_HEAD = [{ id: 'name', label: 'Name', alignRight: false }, { id: '' }];

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
      (_product) => _product.id.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function CoralAreaList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const areaList = useSelector((state: RootState) => state.area.areaList);
  // const arealist = useSelector((state: ProductState) => state.areas);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');
  useEffect(() => {
    dispatch(getListArea());
  }, [dispatch]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = areaList.map((n) => n.name);
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

  const handleDeleteCoralArea = async (id: string) => {
    try {
      try {
        await manageCoral.deleteCoralArea(id).then((respone) => {
          if (respone.status == 200) {
            enqueueSnackbar('Delete success', { variant: 'success' });
            dispatch(getListArea());
          } else {
            enqueueSnackbar('Delete error', { variant: 'error' });
          }
        });
      } catch (error) {
        enqueueSnackbar('Delete error', { variant: 'error' });
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - areaList.length) : 0;

  const filteredProducts = applySortFilter(areaList, getComparator(order, orderBy), filterName);

  const isProductNotFound = filteredProducts.length === 0;
  return (
    <Page title="Coral Area: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Coral Area"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Coral Area', href: PATH_DASHBOARD.coralArea.root },
            { name: 'List' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.coralArea.new}
              startIcon={<Icon icon={plusFill} />}
            >
              New Coral Area
            </Button>
          }
        />
        <Card>
          <CoralAreaListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CoralAreaListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={areaList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, address } = row;
                      const isItemSelected = selected.indexOf(address) !== -1;
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
                          <TableCell align="left">{name}</TableCell>

                          <TableCell align="right">
                            <CoralAreaMoreMenu
                              onDelete={() => handleDeleteCoralArea(id.toString())}
                              areaId={id.toString()}
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
                {isProductNotFound && (
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
            count={areaList.length}
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
