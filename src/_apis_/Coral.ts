import axios from 'axios';

export class Coral {
  getListCoral = () => {
    return axios({
      url: 'http://52.226.16.255:8080/api/v1/admin/corals',
      method: 'GET'
    });
  };
}
export const manageCoral = new Coral();
