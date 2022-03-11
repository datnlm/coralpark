import axios from 'axios';

export class Coral {
  // get list coral
  getListCoral = () => {
    return axios({
      url: 'http://104.45.197.106:8080/api/v1/admin/corals',
      method: 'GET'
    });
  };

  deleteCoral = (id: number) => {
    return axios({
      url: `http://104.45.197.106:8080/api/v1/admin/corals/${id}`,
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  };
}
export const manageCoral = new Coral();
