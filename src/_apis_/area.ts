import axios from 'axios';
import { Area } from '../@types/area';
// @types
export class AreaManager {
  // get list area
  getListArea = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/areas', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  getAreaById = (areaId: string) => {
    return axios
      .get(`/api/v1/admin/areas/${areaId}`)
      .then((res) => res)
      .catch((err) => err);
  };

  getProvince = (Code: string) => {
    return axios
      .get(`/api/v1/provinces?Code=${Code}`)
      .then((res) => res)
      .catch((err) => err);
  };

  createArea = (area: Area) => {
    const data = {
      name: area.name,
      address: area.address,
      wellKnownText: area.wellKnownText
    };
    return axios
      .post('/api/v1/admin/areas', data)
      .then((res) => res)
      .catch((err) => err);
  };

  updateArea = (area: Area) => {
    const data = {
      id: area.id,
      name: area.name,
      address: area.address,
      wellKnownText: area.wellKnownText
    };
    return axios
      .put('/api/v1/admin/areas', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // delete
  deleteArea = (id: string) => {
    return axios
      .delete(`/api/v1/admin/areas/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}

export const manageArea = new AreaManager();
