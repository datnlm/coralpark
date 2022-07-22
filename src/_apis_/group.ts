import axios from 'axios';
import { GroupMode, GroupRole } from '../@types/group';

export class GroupManager {
  // get list update mode
  getListGroupMode = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/group-modes', {
        params: { page_number, page_size }
      })
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
      contribution: groupMode.contribution
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
      contribution: groupMode.contribution
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

  getListGroupRole = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/group-roles', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get update mode by id
  getGroupRoleByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/group-roles/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create update mode
  createGroupRole = (groupRole: GroupRole) => {
    const data = {
      name: groupRole.name,
      personalRate: groupRole.personalRate,
      partnerRate: groupRole.partnerRate,
      groupModeId: groupRole.groupModeId
    };
    return axios
      .post('/api/v1/admin/group-roles', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // update update mode
  updateUpdateRole = (groupRole: GroupRole) => {
    const data = {
      id: groupRole.id,
      name: groupRole.name,
      personalRate: groupRole.personalRate,
      partnerRate: groupRole.partnerRate,
      groupModeId: groupRole.groupModeId
    };
    return axios
      .put('/api/v1/admin/group-roles', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // delete group mode
  deleteGroupRole = (id: string) => {
    return axios
      .delete(`/api/v1/admin/group-roles/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageGroup = new GroupManager();
