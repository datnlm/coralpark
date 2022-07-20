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
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  CardHeader,
  Stack
} from '@material-ui/core';
import { statusOptions } from 'utils/constants';
import CreateCellNewForm from 'components/_dashboard/cell/CreateCellNewForm';
import { getListCell, getListCellType } from 'redux/slices/cell';
import { manageCell } from '_apis_/cell';
import { getListGarden } from 'redux/slices/garden';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { CellListHead, CellListToolbar, CellMoreMenu } from '../../components/_dashboard/cell/list';
import { Cell } from '../../@types/cell';
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

function applySortFilter(array: Cell[], comparator: (a: any, b: any) => number, query: string) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_cell) => _cell.id.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
type CellProps = {
  gardenId?: string;
};

export default function CellList({ gardenId }: CellProps) {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const cellList = useSelector((state: RootState) => state.cell.cellList);
  const totalCount = useSelector((state: RootState) => state.cell.totalCount);
  const isLoading = useSelector((state: RootState) => state.cell.isLoading);
  const [currentCell, setCurrentCell] = useState<Cell>();
  const [isEdit, setIsEdit] = useState(false);
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
      const newSelecteds = cellList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteCell = async (id: string) => {
    try {
      await manageCell.deleteCell(id).then((respone) => {
        if (respone.status == 200) {
          enqueueSnackbar(translate('message.delete-success'), { variant: 'success' });
          if (gardenId != '' && gardenId != null) {
            dispatch(getListCell(gardenId, page, rowsPerPage));
          }
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
    if (gardenId != '' && gardenId != null) {
      dispatch(getListCell(gardenId, page, rowsPerPage));
    }
  }, [dispatch, page, rowsPerPage]);

  const emptyRows = !isLoading && !cellList;

  const filteredCell = applySortFilter(cellList, getComparator(order, orderBy), filterName);

  const isCellNotFound = filteredCell.length === 0 && !isLoading;
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
    { id: 'id', label: translate('page.cell.form.id'), alignRight: false },
    { id: 'type', label: translate('page.cell.form.type'), alignRight: false },
    { id: 'acreage', label: translate('page.cell.form.acreage'), alignRight: false },
    { id: 'items', label: translate('page.cell.form.items'), alignRight: false },
    { id: 'status', label: translate('page.cell.form.status'), alignRight: false },
    { id: '' }
  ];

  const handleClose = (params: boolean) => {
    if (params === true) {
      if (gardenId != '' && gardenId != null) {
        dispatch(getListCell(gardenId, page, rowsPerPage));
      }
    }
    setOpen(false);
  };

  const getCellById = async (id: string) => {
    if (id != null) {
      await manageCell.getCellById(id).then((response) => {
        if (response.status == 200) {
          const data = {
            id: response.data.id,
            gardenId: response.data.gardenId,
            coralCellTypeId: response.data.coralCellTypeId,
            coralCellTypeName: response.data.coralCellTypeName,
            type: {
              id: response.data.coralCellTypeId,
              name: response.data.coralCellTypeName,
              imageUrl: '',
              description: ''
            },
            acreage: response.data.acreage,
            maxItem: response.data.maxItem,
            quantity: '1',
            status: response.data.status
          };
          setCurrentCell(data);
        }
      });
    }
  };
  const handleClickEditOpen = async (id: string) => {
    dispatch(getListCellType(0, -1));
    getCellById(id);
    setIsEdit(true);
    setOpen(true);
  };

  const handleClickOpen = () => {
    dispatch(getListCellType(0, -1));
    setIsEdit(false);
    setOpen(true);
  };
  return (
    <Page title={translate('page.cell.title.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <CardHeader
            sx={{ mb: 2 }}
            action={
              <Button size="small" onClick={handleClickOpen} startIcon={<Icon icon={plusFill} />}>
                {translate('button.save.add')}
              </Button>
            }
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CellListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={cellList.length}
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
                    filteredCell.map((row) => {
                      const { id, acreage, maxItem, coralCellTypeName, status } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;
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
                              {/* <Avatar alt={name} src={imageUrl} /> */}
                              <Typography variant="subtitle2" noWrap>
                                {id}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {coralCellTypeName}
                          </TableCell>
                          <TableCell align="left">{acreage}</TableCell>
                          <TableCell align="left">{maxItem}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={(status == '0' && 'error') || 'success'}
                            >
                              {translate(
                                `status.${statusOptions.find((v: any) => v.id == status)?.label}`
                              )}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <CellMoreMenu
                              onDelete={() => handleDeleteCell(id.toString())}
                              onEdit={() => handleClickEditOpen(id.toString())}
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
                {isCellNotFound && (
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
        <CreateCellNewForm
          open={open}
          onClose={handleClose}
          isEdit={isEdit}
          currentCell={currentCell}
        />
      </Container>
    </Page>
  );
}
