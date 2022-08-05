import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageDiver } from '_apis_/diver';
import { dispatch } from '../store';
// utils
import { Diver, DiverTeam } from '../../@types/diver';

// ----------------------------------------------------------------------

type DiverState = {
  isLoading: boolean;
  isLoadingDiverTeam: boolean;
  error: boolean;
  totalCount: number;
  totalCountDiverTeam: number;
  diverList: Diver[];
  diverTeamList: DiverTeam[];
};

const initialState: DiverState = {
  isLoading: false,
  isLoadingDiverTeam: false,
  error: false,
  totalCount: 0,
  totalCountDiverTeam: 0,
  diverList: [],
  diverTeamList: []
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

    // START LOADING
    startLoadingDiverTeam(state) {
      state.isLoadingDiverTeam = true;
    },

    // TOTOAL COUNT
    totalCount(state, action) {
      state.totalCount = action.payload;
    },
    // TOTOAL COUNT
    totalCountDiverTeam(state, action) {
      state.totalCountDiverTeam = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET LIST Diver
    getListDiver(state, action) {
      state.isLoading = false;
      state.diverList = action.payload;
    },

    // GET LIST Diver
    getListDiverTeam(state, action) {
      state.isLoadingDiverTeam = false;
      state.diverTeamList = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { totalCount } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListDiver(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageDiver.getListDiver(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListDiver(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// get Diver team
export function getListDiverTeam(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoadingDiverTeam());
    try {
      await manageDiver.getListDiverTeam(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCountDiverTeam(response.data.metaData.totalCount));
          dispatch(slice.actions.getListDiverTeam(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// get Diver team
export function getListDiverTeamById(diverId: string, page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoadingDiverTeam());
    try {
      await manageDiver.getListDiverTeamById(diverId, 1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCountDiverTeam(response.data.metaData.totalCount));
          dispatch(slice.actions.getListDiverTeam(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
