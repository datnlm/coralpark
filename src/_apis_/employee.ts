import axios from 'axios';
import { Employee } from '../@types/employee';

export class EmployeeManager {
  // get list diver
  getListEmployee = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/employee-partners', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get diver by id
  getEmployeeByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/employee-partners/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create
  createEmployee = (staff: any) => {
    return axios
      .post('/api/v1/admin/employee-partners', staff, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // update
  updateEmployee = (staff: any) => {
    return axios
      .put('/api/v1/admin/employee-partners', staff, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete diver
  deleteEmployee = (id: string) => {
    return axios
      .delete(`/api/v1/admin/employee-partners/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageEmployee = new EmployeeManager();
