import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageCell } from '_apis_/cell';
import { dispatch } from '../store';
// utils
import { CellType } from '../../@types/cell-type';
import { Cell } from '../../@types/cell';

// ----------------------------------------------------------------------

type CellState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  cellList: Cell[];
  cellTypeList: CellType[];
};

const initialState: CellState = {
  isLoading: false,
  error: false,
  totalCount: 0,
  cellList: [],
  cellTypeList: []
};

const slice = createSlice({
  name: 'cell',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    endLoading(state) {
      state.isLoading = false;
    },

    // TOTOAL COUNT
    totalCount(state, action) {
      state.totalCount = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getListCell(state, action) {
      state.isLoading = false;
      state.cellList = action.payload;
    },

    getListCellType(state, action) {
      state.isLoading = false;
      state.cellTypeList = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getListCell(gardenId: string, page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageCell.getListCell(gardenId, 1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListCell(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListCellType(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageCell.getListCellType(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListCellType(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
