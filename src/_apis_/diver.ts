import axios from 'axios';
import { apiCon } from './api';
import { Diver } from '../@types/diver';

export class DiverManager {
  // get list diver
  getListDiver = () => {
    return axios
      .get('/api/v1/admin/divers')
      .then((res) => res)
      .catch((err) => err);
  };

  // get diver by id
  getDiverByID = (diverID: string) => {
    return axios
      .get(`/api/v1/admin/divers/${diverID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create diver
  createDiver = (diver: any) => {
    return axios
      .post('/api/v1/admin/divers', diver, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // update diver
  updateDiver = (diver: any) => {
    return axios
      .put('/api/v1/admin/divers', diver, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete diver
  deleteDiver = (diverID: string) => {
    return axios
      .delete(`/api/v1/admin/divers/${diverID}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageDiver = new DiverManager();
