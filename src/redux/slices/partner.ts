import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { managePartner } from '_apis_/partner';
import { dispatch } from '../store';
// utils
import { Partner, PartnerType } from '../../@types/partner';

// ----------------------------------------------------------------------

type PartnerState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  partnerList: Partner[];
  partnerTypeList: PartnerType[];
};

const initialState: PartnerState = {
  isLoading: false,
  error: false,
  totalCount: 0,
  partnerList: [],
  partnerTypeList: []
};

const slice = createSlice({
  name: 'diver',
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

    // GET LIST partner
    getListPartner(state, action) {
      state.isLoading = false;
      state.partnerList = action.payload;
    },

    getListPartnerType(state, action) {
      state.isLoading = false;
      state.partnerTypeList = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
// export const { deleteDiver } = slice.actions;

// ----------------------------------------------------------------------

// get partner
export function getListPartner(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await managePartner.getListPartner(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListPartner(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// get partner
export function getListPartnerType(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await managePartner.getListPartnerType(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListPartnerType(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
