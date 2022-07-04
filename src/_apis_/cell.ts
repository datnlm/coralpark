import axios from 'axios';
import { Cell } from '../@types/cell';

export class CellManager {
  getListCell = (gardenId: string, page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/coral-cells', {
        params: { gardenId, page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  getCellById = (id: string) => {
    return axios
      .get(`/api/v1/admin/coral-cells/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  createCell = (cell: Cell) => {
    const data = [];
    const number_of_quantity = parseInt(cell.quantity, 10);
    for (let index = 0; index < number_of_quantity; index++) {
      data.push({
        acreage: cell.acreage,
        maxItem: cell.maxItem,
        gardenId: cell.gardenId,
        coralCellTypeId: cell.type!.id
      });
    }
    return axios
      .post('/api/v1/admin/coral-cells', data)
      .then((res) => res)
      .catch((err) => err);
  };

  updateCell = (cell: any) => {
    return axios
      .post('/api/v1/admin/coral-cell-types', cell, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

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
