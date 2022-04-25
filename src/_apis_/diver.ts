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
      .get('/api/v1/admin/divers', {
        params: { id: diverID }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // create diver
  createDiver = (diver: Diver) => {
    const data = {
      name: diver.name,
      phone: diver.phone,
      email: diver.email,
      address: diver.address,
      status: diver.status
    };
    axios.post('/api/v1/admin/divers', data);
  };

  // update diver
  updateDiver = (diver: Diver) => {
    const data = {
      id: diver.id,
      name: diver.name,
      phone: diver.phone,
      email: diver.email,
      address: diver.address,
      status: diver.status
    };
    axios.put('/api/v1/admin/divers', data);
  };

  // delete diver
  deleteDiver = (diverID: string) => {
    return axios
      .delete('/api/v1/admin/divers', {
        data: { id: diverID }
      })
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageDiver = new DiverManager();
