import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageGroup } from '_apis_/group';
import { dispatch } from '../store';
// utils
import { GroupMode, GroupRole } from '../../@types/group';

// ----------------------------------------------------------------------

type GroupModeState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  groupModeList: GroupMode[];
  groupRoleList: GroupRole[];
};

const initialState: GroupModeState = {
  isLoading: false,
  error: false,
  totalCount: 0,
  groupModeList: [],
  groupRoleList: []
};

const slice = createSlice({
  name: 'groupMode',
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

    // GET LIST GROUP MODE
    getListGroupMode(state, action) {
      state.isLoading = false;
      state.groupModeList = action.payload;
    },

    // GET LIST GROUP MODE
    getListGroupRole(state, action) {
      state.isLoading = false;
      state.groupRoleList = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
// export const { deleteDiver } = slice.actions;

// ----------------------------------------------------------------------

export function getListGroupMode(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageGroup.getListGroupMode(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListGroupMode(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListGroupRole(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageGroup.getListGroupRole(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListGroupRole(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
