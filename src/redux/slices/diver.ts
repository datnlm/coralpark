import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageDiver } from '_apis_/diver';
import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import { Diver } from '../../@types/diver';
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
  Coral
} from '../../@types/user';

// ----------------------------------------------------------------------

type UserState = {
  isLoading: boolean;
  error: boolean;
  followers: Follower[];
  diverList: Diver[];
};

const initialState: UserState = {
  isLoading: false,
  error: false,
  followers: [],
  diverList: []
};

const slice = createSlice({
  name: 'user',
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

    // GET FOLLOWERS
    getFollowersSuccess(state, action) {
      state.isLoading = false;
      state.followers = action.payload;
    },

    // ON TOGGLE FOLLOW
    onToggleFollow(state, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed
          };
        }
        return follower;
      });

      state.followers = handleToggle;
    },

    // GET LIST Diver
    getListDiver(state, action) {
      state.isLoading = false;
      state.diverList = action.payload;
    },

    // DELETE DIVER
    deleteDiver(state, action) {
      const deleteDiver = filter(state.diverList, (diver) => diver.id !== action.payload);
      state.diverList = deleteDiver;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteDiver } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListDiver() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      manageDiver.getListDiver().then((response) => {
        dispatch(slice.actions.getListDiver(response.data.items));
        // console.log(response!.data!.items);
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
