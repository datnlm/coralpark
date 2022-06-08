import axios from 'axios';
import { Technician, TechnicianArea } from '../@types/technicians';

export class TechnicanManager {
  // get list diver
  getListTechnican = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/technicians', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get diver by id
  getTechnicanByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/technicians/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create diver
  createTechnican = (technician: any) => {
    return axios
      .post('/api/v1/admin/technicians', technician, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // update diver
  updateTechnican = (technican: any) => {
    return axios
      .put('/api/v1/admin/technicians', technican, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete diver
  deleteTechnican = (id: string) => {
    return axios
      .delete(`/api/v1/admin/technicians/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  createTechnicanArea = (technicianArea: TechnicianArea) => {
    const data = {
      technicians: technicianArea.technicians,
      id: technicianArea.area.id
    };
    return axios
      .post('/api/v1/admin/technician-areas/technicians', data)
      .then((res) => res)
      .catch((err) => err);
  };

  updateTechnicanArea = (technicianArea: TechnicianArea) => {
    const data = {
      technicians: technicianArea.technicians,
      id: technicianArea.area.id
    };
    return axios
      .put('/api/v1/admin/technician-areas/technicians', data)
      .then((res) => res)
      .catch((err) => err);
  };

  deleteTechnicanArea = (id: string) => {
    return axios
      .delete(`/api/v1/admin/technician-areas/technicians/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageTechnican = new TechnicanManager();
