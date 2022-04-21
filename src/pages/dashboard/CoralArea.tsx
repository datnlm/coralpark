import * as React from 'react';
import PropTypes from 'prop-types';
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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useState, useEffect } from 'react';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import Scrollbar from '../../components/Scrollbar';
import useSettings from '../../hooks/useSettings';
import { AreaListHead, AreaListToolbar, AreaMoreMenu } from '../../components/_dashboard/area/list';
import { Product, ProductState, Area } from '../../@types/products';
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts, getAreas } from '../../redux/slices/product';

const TABLE_HEAD = [{ id: 'name', label: 'Area', alignRight: false }];

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

function createData(name: string) {
  return {
    name,
    coral: [
      {
        name: 'Ten coral 1',
        scientific: 'Ten khoa hoc',
        status: 3
      },
      {
        name: '2020-01-02',
        scientific: 'Anonymous',
        status: 1
      }
    ]
  };
}

const rows = [
  createData('Nha Trang'),
  createData('Phú Quốc'),
  createData('Kiên Giang'),
  createData('Phan Thiết'),
  createData('Vĩnh Long')
];

export default function CollapsibleTable() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { products } = useSelector((state: { product: ProductState }) => state.product);
  const arealist = useSelector((state: { product: ProductState }) => state.product.areas);
  // const arealist = useSelector((state: ProductState) => state.areas);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getAreas());
  }, [dispatch]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const selected = products.map((n) => n.name);
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

  const handleDeleteUser = async (areaID: string) => {
    try {
      // await manageCoral.deleteCoral(areaID).then((respone) => {
      //   if (respone.status === 200) {
      //     dispatch(getListCoral());
      //   }
      // });
    } catch (error) {
      console.log(error);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  const filteredProducts = applySortFilter(arealist, getComparator(order, orderBy), filterName);

  const isProductNotFound = filteredProducts.length === 0;
  return (
    <Page title="Coral Area: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Coral Area"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Cora Area', href: PATH_DASHBOARD.coralArea.root },
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
          <AreaListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          <Scrollbar>
            {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between"> */}
            <TableContainer component={Paper}>
              <Table>
                <AreaListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={arealist.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {rows.map((row) => (
                    <Row key={row.name} row={row} />
                  ))}
                  {emptyRows > 0 && (
                    <TableRow sx={{ minWidth: 800 }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );

  function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <div>
        <TableRow sx={{ p: { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell sx={{ minWidth: 800 }}> {row.name} </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Coral
                </Typography>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Scientific name</TableCell>
                        <TableCell align="left">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.coral.map((coralRow) => (
                        <TableRow key={coralRow.name}>
                          <TableCell component="th" scope="row">
                            {coralRow.name}
                          </TableCell>
                          <TableCell>{coralRow.scientific}</TableCell>
                          <TableCell>{coralRow.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        {/* </TableContainer> */}
      </div>
    );
  }
}
