import axios from 'axios';
import { GroupMode } from '../@types/group-mode';

export class GroupModeManager {
  // get list update mode
  getListGroupMode = () => {
    return axios
      .get('/api/v1/admin/group-modes')
      .then((res) => res)
      .catch((err) => err);
  };

  // get update mode by id
  getGroupModeByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/group-modes/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create update mode
  createGroupMode = (groupMode: GroupMode) => {
    const data = {
      name: groupMode.name,
      contribute: groupMode.contribute
    };
    return axios
      .post('/api/v1/admin/group-modes', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // update update mode
  updateUpdateMode = (groupMode: GroupMode) => {
    const data = {
      id: groupMode.id,
      name: groupMode.name,
      contribute: groupMode.contribute
    };
    return axios
      .put('/api/v1/admin/group-modes', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // delete group mode
  deleteGroupMode = (id: string) => {
    return axios
      .delete(`/api/v1/admin/group-modes/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageGroupMode = new GroupModeManager();
