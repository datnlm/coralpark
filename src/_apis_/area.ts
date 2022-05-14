import axios from 'axios';
import { apiCon } from './api';
// @types
export class Area {
  // get list area
  getArea = () => {
    return axios
      .get('/api/v1/admin/areas')
      .then((res) => res)
      .catch((err) => err);
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
  // getAreaByID = (id: string) => {
  //   return axios({
  //     url: `${apiCon.host}admin/areas/${id}`,
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTGUgVGFuIFRydW9uZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InRydW9uZ2x0c2UxNDA5MDNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQUQiLCJuYmYiOjE2NTA0Njc4ODYsImV4cCI6MTY1MDQ3NTA4NiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEifQ.FKYyosI_-sa-9yX4jALJj6UG7dPGeXiFX08qvopPbdM`
  //     }
  //   });
  // };

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
