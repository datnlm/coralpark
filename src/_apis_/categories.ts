import axios from 'axios';
import { Categories } from '../@types/categories';

export class CategoriesManager {
  // get list Categories
  getListCategories = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/categories', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get update Categories id
  getCategoriesByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/categories/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create Categories
  createCategories = (categories: Categories) => {
    const data = {
      name: categories.name
    };
    return axios
      .post('/api/v1/admin/categories', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // update Categories
  updateUpdateCategories = (categories: Categories) => {
    const data = {
      id: categories.id,
      name: categories.name
    };
    return axios
      .put('/api/v1/admin/categories', data)
      .then((response) => response)
      .catch((err) => err);
  };

  // delete Categories
  deleteCategories = (id: string) => {
    return axios
      .delete(`/api/v1/admin/categories/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageCategories = new CategoriesManager();
