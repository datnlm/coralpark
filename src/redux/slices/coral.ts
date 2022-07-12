import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import { Coral, CoralHealth, CoralType, Phases } from '../../@types/coral';

// ----------------------------------------------------------------------

type UserState = {
  isLoading: boolean;
  error: boolean;
  coralList: Coral[];
  coralListType: CoralType[];
  // loai coral
  coralType: CoralType[];
  coralPhaseList: Phases[];
  coralHealthList: CoralHealth[];
  totalCount: number;
};

const initialState: UserState = {
  isLoading: false,
  error: false,
  coralList: [],
  coralListType: [],
  // loai coral
  coralType: [],
  coralPhaseList: [],
  coralHealthList: [],
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
    },

    getListCoralHealth(state, action) {
      state.isLoading = false;
      state.coralHealthList = action.payload;
    },

    getListCoralPhase(state, action) {
      state.isLoading = false;
      state.coralPhaseList = action.payload;
    },

    getCoralType(state, action) {
      state.isLoading = false;
      state.coralType = action.payload;
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
      await manageCoral.getListCoral(1 + page, rowsPerPage).then((response) => {
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
      await manageCoral.getListCoralType(1 + page, rowsPerPage).then((response) => {
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

// get loai species coral
export function getCoralType(coralType: string, page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageCoral.getCoralType(coralType, 1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getCoralType(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// get list coral phase
export function getListCoralPhase(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageCoral.getListCoralPhases(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListCoralPhase(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListCoralHealth(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageCoral.getListCoralHealth(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListCoralHealth(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
