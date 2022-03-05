import axios from 'axios';

export class Coral {
  getListCoral = () => {
    return axios({
      url: 'http://104.45.197.106:8080/api/v1/admin/corals',
      method: 'GET'
    });
  };
}
export const manageCoral = new Coral();
