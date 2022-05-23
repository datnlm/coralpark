import axios from 'axios';
// @types
export class Area {
  // get list area
  getArea = () => {
    return axios
      .get('/api/v1/admin/areas')
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
}

export const manageArea = new Area();
