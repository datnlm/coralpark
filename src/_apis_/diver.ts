import axios from 'axios';
import { apiCon } from './api';
import { Diver } from '../@types/diver';

export class DiverManager {
  // get list diver
  getListDiver = () => {
    return axios({
      url: `${apiCon.host}admin/divers`,
      method: 'GET'
    });
  };

  // get diver by id
  getDiverByID = (id: string) => {
    return axios({
      url: `${apiCon.host}admin/divers/${id}`,
      method: 'GET'
    });
  };

  // create diver
  createDiver = (diver: Diver) => {
    const dt = {
      name: diver.name,
      phone: diver.phone,
      email: diver.email,
      address: diver.address,
      status: diver.status
    };
    return axios({
      url: `${apiCon.host}admin/divers/`,
      method: 'POST',
      data: dt
    });
  };

  // update diver
  updateArea = (diver: Diver) => {
    const dt = {
      name: diver.name,
      phone: diver.phone,
      email: diver.email,
      address: diver.address,
      status: diver.status
    };
    return axios({
      url: `${apiCon.host}admin/divers/`,
      method: 'PUT',
      data: dt
    });
  };

  // delete diver
  deleteDiver = (id: string) => {
    return axios({
      url: `${apiCon.host}admin/divers/${id}`,
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  };
}
export const manageDiver = new DiverManager();
