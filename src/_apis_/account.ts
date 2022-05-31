import axios from 'axios';
import { User } from '../@types/account';

export class AccountManager {
  // get list account
  getListAccount = () => {
    return axios
      .get('/api/v1/admin/accounts')
      .then((res) => res)
      .catch((err) => err);
  };

  // get diver by id
  getAccountByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/accounts/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create diver
  createAccount = (account: any) => {
    return axios
      .post('/api/v1/admin/divers', account, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // update diver
  updateAccount = (account: any) => {
    return axios
      .put('/api/v1/admin/divers', account, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete diver
  deleteAccount = (id: string, roleName: string) => {
    return axios
      .delete(`/api/v1/admin/accounts/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageAccount = new AccountManager();
