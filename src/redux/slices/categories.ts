import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageCategories } from '_apis_/categories';
import { dispatch } from '../store';
// utils
import { Categories } from '../../@types/categories';

// ----------------------------------------------------------------------

type CategoriesState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  categoriesList: Categories[];
};

const initialState: CategoriesState = {
  isLoading: false,
  error: false,
  totalCount: 0,
  categoriesList: []
};

const slice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
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

    // GET LIST Diver
    getListCategories(state, action) {
      state.isLoading = false;
      state.categoriesList = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

// get area
export function getListCategories(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageCategories.getListCategories(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListCategories(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
