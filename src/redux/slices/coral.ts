import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import {
  Friend,
  Gallery,
  Profile,
  UserPost,
  Follower,
  UserData,
  CreditCard,
  UserInvoice,
  UserManager,
  UserAddressBook,
  NotificationSettings,
  AreaProvice,
  Coral,
  CoralType
} from '../../@types/coral';

// ----------------------------------------------------------------------

type UserState = {
  isLoading: boolean;
  error: boolean;
  coralList: Coral[];
  coralListType: CoralType[];
  totalCount: number;
};

const initialState: UserState = {
  isLoading: false,
  error: false,
  coralList: [],
  coralListType: [],
  totalCount: 0
};

const slice = createSlice({
  name: 'user',
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

    // // GET PROVICE
    // getAreaProvice(state, action) {
    //   state.isLoading = false;
    //   state.proviceList = action.payload;
    // },

    // GET LISTCORAL
    getListCoral(state, action) {
      state.isLoading = false;
      state.coralList = action.payload;
    },

    getListCoralType(state, action) {
      state.isLoading = false;
      state.coralListType = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// CoralPark
// ----------------------------------------------------------------------

// get Coral
export function getListCoral(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageCoral.getListCoral(page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListCoral(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListCoralType(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageCoral.getListCoralType(page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListCoralType(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
