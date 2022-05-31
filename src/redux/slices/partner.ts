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
  partnerList: Partner[];
  partnerTypeList: PartnerType[];
};

const initialState: PartnerState = {
  isLoading: false,
  error: false,
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

    // DELETE DIVER
    // deleteDiver(state, action) {
    //   const deleteDiver = filter(state.areaList, (area) => area.id !== action.payload);
    //   state.areaList = deleteDiver;
    // }
  }
});
// Reducer
export default slice.reducer;

// Actions
// export const { deleteDiver } = slice.actions;

// ----------------------------------------------------------------------

// get partner
export function getListPartner() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await managePartner.getListPartner().then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListPartner(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// get partner
export function getListPartnerType() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await managePartner.getListPartnerType().then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListPartnerType(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
