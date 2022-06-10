import axios from 'axios';
import { Staff } from '../@types/staff';

export class StaffManager {
  // get list diver
  getListStaff = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/employee-partners', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get diver by id
  getStaffByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/employee-partners/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create
  createStaff = (staff: any) => {
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
  updateStaff = (staff: any) => {
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
  deleteStaff = (id: string) => {
    return axios
      .delete(`/api/v1/admin/employee-partners/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageStaff = new StaffManager();
