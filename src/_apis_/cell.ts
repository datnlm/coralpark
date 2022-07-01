import axios from 'axios';

export class CellManager {
  getListCellType = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/coral-cell-types', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  getCellTypeById = (id: string) => {
    return axios
      .get(`/api/v1/admin/coral-cell-types/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  createCellType = (cell: any) => {
    return axios
      .post('/api/v1/admin/coral-cell-types', cell, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  updateCellType = (cell: any) => {
    return axios
      .put('/api/v1/admin/coral-cell-types', cell, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  deleteCellType = (id: string) => {
    return axios
      .delete(`/api/v1/admin/coral-cell-types/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageCell = new CellManager();
