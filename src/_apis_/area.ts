import axios from 'axios';

export class Area {
  // get list area
  getArea = () => {
    return axios({
      url: 'http://104.45.197.106:8080/api/v1/admin/areas',
      method: 'GET'
    });
  };

  //   // delete
  //   deleteCoral = (id: number) => {
  //     return axios({
  //       url: `http://104.45.197.106:8080/api/v1/admin/corals/${id}`,
  //       method: 'DELETE',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //   };

  //   // getCoralbyID
  //   getCoralByID = (id: string) => {
  //     return axios({
  //       url: `http://104.45.197.106:8080/api/v1/admin/corals/${id}`,
  //       method: 'GET'
  //     });
  //   };
}
export const manageArea = new Area();
