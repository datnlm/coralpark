import axios from 'axios';
import { apiCon } from './api';
// @types
export class Area {
  // get list area
  getArea = () => {
    return axios({
      url: `${apiCon.host}admin/areas`,
      method: 'GET'
    });
  };

  // delete
  deleteArea = (id: string) => {
    return axios({
      url: `${apiCon.host}admin/areas/${id}`,
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  };

  // getAreaByID
  getAreaByID = (id: string) => {
    return axios({
      url: `${apiCon.host}admin/areas/${id}`,
      method: 'GET'
    });
  };

  // updateArea
  updateArea = (idd: string = '', locationn: string, addresss: string, provinceIDD: string) => {
    const dt = {
      id: parseInt(idd, 10),
      location: locationn,
      address: addresss,
      provinceID: 1,
      provinceName: 'string'
    };
    return axios({
      url: `${apiCon.host}admin/areas/`,
      method: 'PUT',
      data: dt
    });
  };

  createArea = (locationn: string, addresss: string, provinceIDD: string) => {
    const dt = {
      id: parseInt('0', 10),
      location: locationn,
      address: addresss,
      provinceID: 1,
      provinceName: 'string'
    };
    return axios({
      url: `${apiCon.host}admin/areas/`,
      method: 'POST',
      data: dt
    });
  };
}

// createArea

export const manageArea = new Area();
