import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageGarden } from '_apis_/garden';
import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';

import { Garden, Site, GardenType } from '../../@types/garden';

// ----------------------------------------------------------------------

type GardenState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  gardenList: Garden[];
  siteList: Site[];
  gardenTypesList: GardenType[];
};

const initialState: GardenState = {
  isLoading: false,
  error: false,
  totalCount: 0,
  gardenList: [],
  siteList: [],
  gardenTypesList: []
};

const slice = createSlice({
  name: 'garden',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // END LOADING
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

    // GET LIST Garden
    getListGarden(state, action) {
      state.isLoading = false;
      state.gardenList = action.payload;
    },

    // DELETE DIVER
    deleteGarden(state, action) {
      const deleteGarden = filter(state.gardenList, (diver) => diver.id !== action.payload);
      state.gardenList = deleteGarden;
    },

    // ---------------------------------------------------------------
    // GET LIST Garden owners
    getListGardenOwners(state, action) {
      state.isLoading = false;
      state.siteList = action.payload;
    },

    // ---------------------------------------------------------------
    // GET LIST Garden type
    getListGardenType(state, action) {
      state.isLoading = false;
      state.gardenTypesList = action.payload;
    },

    // DELETE EVENT
    deleteGardenType(state, action) {
      const deleteGardenType = filter(
        state.gardenTypesList,
        (gardenType) => gardenType.id !== action.payload
      );
      state.gardenTypesList = deleteGardenType;
    },

    // DELETE USERS
    deleteSite(state, action) {
      const deleteSite = filter(state.siteList, (site) => site.id !== action.payload);
      state.siteList = deleteSite;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { deleteGarden, deleteGardenType, deleteSite } = slice.actions;

// ----------------------------------------------------------------------

// get garden
export function getListGarden(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageGarden.getListGarden(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListGarden(response.data.items));
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
// get garden
export function getListSites(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageGarden.getListSites(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListGardenOwners(response.data.items));
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
// get garden type
export function getListGardenTypes(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageGarden.getListGardenType(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListGardenType(response.data.items));
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// delete garden type
export function deleteGardenTypes(gardenTypeID: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageGarden.deleteGardenType(gardenTypeID);
      dispatch(slice.actions.endLoading());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
