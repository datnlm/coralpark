import { filter } from 'lodash';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { manageArea } from '_apis_/area';
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
  CircularProgress,
  Stack,
  CardHeader
} from '@material-ui/core';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import SearchNotFound from 'components/SearchNotFound';
import Scrollbar from 'components/Scrollbar';
import { getListArea } from 'redux/slices/area';
import { RootState, useDispatch, useSelector } from 'redux/store';
import useSettings from 'hooks/useSettings';
import { AreaListHead, AreaListToolbar, AreaMoreMenu } from '../area/list';
import { Area } from '../../../@types/area';
import { Coral } from '../../../@types/coral';
import CoralAreaNewForm from './CoralAreaNewForm';
// ----------------------------------------------------------------------

const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

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
      (_product) => _product.address.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------
type CoralAreaListNewProps = {
  isEdit: boolean;
  currentCoral?: Coral;
};
export default function CoralAreaList({ isEdit, currentCoral }: CoralAreaListNewProps) {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [areaList, setAreaList] = useState<Area[]>([]);
  const areaList2 = useSelector((state: RootState) => state.area.areaList);
  const [totalCount, setTotalCount] = useState<number>(0);
  const isLoading = useSelector((state: RootState) => state.area.isLoading);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');

  useEffect(() => {
    dispatch(getListArea(0, -1));
  }, [dispatch]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const selected = areaList.map((n) => n.name);
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

  const handleDeleteArea = async (areaId: string) => {
    try {
      await manageArea.deleteArea(areaId).then((respone) => {
        if (respone.status == 200) {
          enqueueSnackbar(translate('message.delete-success'), { variant: 'success' });
          dispatch(getListArea(page, rowsPerPage));
        } else {
          enqueueSnackbar(translate('message.delete-error'), { variant: 'error' });
        }
      });
    } catch (error) {
      enqueueSnackbar(translate('message.delete-error'), { variant: 'error' });
      console.log(error);
    }
  };

  const emptyRows = !isLoading && !areaList;

  const filteredArea = applySortFilter(
    currentCoral?.areas ?? [],
    getComparator(order, orderBy),
    filterName
  );

  const isAreaNotFound = filteredArea.length === 0 && !isLoading;

  const TABLE_HEAD = [
    { id: 'name', label: translate('page.area.form.name'), alignRight: false },
    { id: 'address', label: translate('page.area.form.address'), alignRight: false },
    { id: '' }
  ];

  useEffect(() => {
    if (currentCoral?.areas != null) {
      const listAreaId: number[] = [];
      currentCoral?.areas.map((v: any) => listAreaId.push(v.areaId));
      setAreaList(areaList2.filter((area) => listAreaId.includes(Number(area.id))));
      setTotalCount(currentCoral.areas.length);
    }
  }, []);

  const handleClickOpen = () => {
    // dispatch(getListCellType(0, -1));
    // setIsEdit(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Page title={translate('page.area.title.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
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
                <Button size="small" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
                  {translate('button.save.add')}
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
                  rowCount={areaList.length}
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
                    filteredArea.map((row, index) => {
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
                            <AreaMoreMenu
                              onDelete={() => handleDeleteArea(id.toString())}
                              areaId={id.toString()}
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

                {isAreaNotFound && (
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
            rowsPerPageOptions={[5, 10, 25, { label: translate('message.all'), value: -1 }]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <CoralAreaNewForm
          currentCoral={currentCoral}
          areaList={areaList}
          open={open}
          onClose={handleClose}
          isEdit={isEdit}
        />
      </Container>
    </Page>
  );
}
