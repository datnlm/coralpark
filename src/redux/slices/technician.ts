import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageTechnican } from '_apis_/technician';
import { dispatch } from '../store';
// utils
import { Technician } from '../../@types/technicians';

// ----------------------------------------------------------------------

type TechnicianState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  technicianList: Technician[];
};

const initialState: TechnicianState = {
  isLoading: false,
  error: false,
  totalCount: 0,
  technicianList: []
};

const slice = createSlice({
  name: 'technician',
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

    // GET LIST Diver
    getListTechnician(state, action) {
      state.isLoading = false;
      state.technicianList = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

// get area
export function getListTechnician(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageTechnican.getListTechnican(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListTechnician(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
