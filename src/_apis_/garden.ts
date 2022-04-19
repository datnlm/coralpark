import axios from 'axios';
import { apiCon } from './api';
import { Garden } from '../@types/garden';

export class GardenManager {
  // get list garden
  getListGarden = () => {
    return axios({
      url: `${apiCon.host}admin/gardens`,
      method: 'GET'
    });
  };

  // get garden by id
  getGardenByID = (id: string) => {
    return axios({
      url: `${apiCon.host}admin/gardens/${id}`,
      method: 'GET'
    });
  };

  // create garden
  createGarden = (garden: Garden) => {
    const dt = {
      name: garden.name,
      location: garden.location,
      address: garden.address,
      acreage: garden.acreage,
      quantityOfCells: garden.quantityOfCells,
      areaID: garden.areaID,
      gardenTypeId: garden.gardenOwnerId,
      gardenOwnerId: garden.gardenOwnerId,
      status: garden.status
    };
    return axios({
      url: `${apiCon.host}admin/gardens/`,
      method: 'POST',
      data: dt
    });
  };

  // update gardens
  updateGarden = (garden: Garden) => {
    const dt = {
      id: garden.id,
      name: garden.name,
      location: garden.location,
      address: garden.address,
      acreage: garden.acreage,
      quantityOfCells: garden.quantityOfCells,
      areaID: garden.areaID,
      gardenTypeId: garden.gardenOwnerId,
      gardenOwnerId: garden.gardenOwnerId,
      status: garden.status
    };
    return axios({
      url: `${apiCon.host}admin/gardens/`,
      method: 'PUT',
      data: dt
    });
  };

  // delete garden
  deleteGarden = (id: string) => {
    return axios({
      url: `${apiCon.host}admin/gardens/${id}`,
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  };
}
export const manageGarden = new GardenManager();
