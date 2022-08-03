import axios from 'axios';

export class EmployeeManager {
  getListEmployee = (roleId: string, page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/staffs', {
        params: { roleId, page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  getListSiteManagerById = (
    siteId: string,
    roleId: string,
    page_number: number,
    page_size: number
  ) => {
    return axios
      .get('/api/v1/admin/staffs', {
        params: { roleId, siteId, page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get emp by id
  getEmployeeByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/staffs/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create
  createEmployee = (staff: any) => {
    return axios
      .post('/api/v1/admin/staffs', staff, {
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
      .put('/api/v1/admin/staffs', staff, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete emp
  deleteEmployee = (id: string) => {
    return axios
      .delete(`/api/v1/admin/staffs'${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // get list emp partner
  getListEmployeePartner = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/employee-partners', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  getListEmployeePartnerById = (PartnerId: String, page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/employee-partners', {
        params: { PartnerId, page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get emp by id
  getEmployeePartnerByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/employee-partners/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create
  createEmployeePartner = (staff: any) => {
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
  updateEmployeePartner = (staff: any) => {
    return axios
      .put('/api/v1/admin/employee-partners', staff, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete emp
  deleteEmployeePartner = (id: string) => {
    return axios
      .delete(`/api/v1/admin/employee-partners/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageEmployee = new EmployeeManager();
