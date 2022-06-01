import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageGroupMode } from '_apis_/group-mode';
import { dispatch } from '../store';
// utils
import { GroupMode } from '../../@types/group-mode';

// ----------------------------------------------------------------------

type AreaState = {
  isLoading: boolean;
  error: boolean;
  groupModeList: GroupMode[];
};

const initialState: AreaState = {
  isLoading: false,
  error: false,
  groupModeList: []
};

const slice = createSlice({
  name: 'groupMode',
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

    // GET LIST Diver
    getListGroupMode(state, action) {
      state.isLoading = false;
      state.groupModeList = action.payload;
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

// get area
export function getListGroupMode() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageGroupMode.getListGroupMode().then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListGroupMode(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
