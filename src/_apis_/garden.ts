import axios from 'axios';
import { apiCon } from './api';
import { Garden, GardenOwner, GardenType } from '../@types/garden';

export class GardenManager {
  // get list garden
  getListGarden = () => {
    return axios
      .get('/api/v1/admin/gardens')
      .then((res) => res)
      .catch((err) => err);
  };

  // get garden by id
  getGardenByID = (gardenID: string) => {
    return axios
      .get(`/api/v1/admin/gardens/${gardenID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create garden
  createGarden = (garden: Garden) => {
    const data = {
      name: garden.name,
      location: garden.location,
      address: garden.address,
      acreage: garden.acreage,
      quantityOfCells: garden.quantityOfCells,
      areaID: garden.areaID,
      gardenTypeId: garden.gardenTypeId,
      gardenOwnerId: garden.gardenOwnerId,
      staffId: garden.staffId,
      status: 1
    };
    axios.post('/api/v1/admin/gardens', data);
  };

  // update garden
  updateGarden = (garden: Garden) => {
    const data = {
      id: garden.id,
      name: garden.name,
      location: garden.location,
      address: garden.address,
      acreage: garden.acreage,
      quantityOfCells: garden.quantityOfCells,
      areaID: garden.areaID,
      gardenTypeId: garden.gardenTypeId,
      gardenOwnerId: garden.gardenOwnerId,
      staffId: garden.staffId,
      status: garden.status
    };
    axios.put('/api/v1/admin/gardens', data);
  };

  // delete garden
  deleteGarden = (gardenID: string) => {
    return axios
      .delete(`/api/v1/admin/gardens/${gardenID}`)
      .then((res) => res)
      .catch((err) => err);
  };
  //-----------------------------------------------

  // get garden owners
  getListGardenOwners = () => {
    return axios
      .get('/api/v1/admin/garden-owners')
      .then((res) => res)
      .catch((err) => err);
  };

  // get garden owners by id
  getGardenOwnerByID = (gardenOwnerID: string) => {
    return axios
      .get(`/api/v1/admin/garden-owners/${gardenOwnerID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create garden owner
  createGardenOwner = (owner: GardenOwner) => {
    // imageUrl: 'owner.imageUrl',
    const data = {
      name: owner.name,
      phone: owner.phone,
      email: owner.email,
      address: owner.address,
      imageUrl: 'https://cdn.dribbble.com/users/7057015/screenshots/15127355/thor_4x.png'
    };
    axios.post('/api/v1/admin/garden-owners', data);
  };

  // update garden owner
  updateGardenOwner = (owner: GardenOwner) => {
    const data = {
      id: owner.id,
      name: owner.name,
      phone: owner.phone,
      email: owner.email,
      address: owner.address,
      imageUrl: 'https://cdn.dribbble.com/users/7057015/screenshots/15127355/thor_4x.png'
    };
    axios.put('/api/v1/admin/garden-owners', data);
  };

  // delete garden owner
  deleteGardenOwner = (gardenOwnerID: string) => {
    return axios
      .delete(`/api/v1/admin/garden-owners/${gardenOwnerID}`)
      .then((res) => res)
      .catch((err) => err);
  };
  //-----------------------------------------------

  // get garden type
  getListGardenType = () => {
    return axios
      .get('/api/v1/admin/garden-types')
      .then((res) => res)
      .catch((err) => err);
  };

  // get garden type by id
  // getGardenTypeByID = (gardenTypeID: string) => {
  //   return axios
  //     .get('/api/v1/admin/garden-types', {
  //       params: { gardenTypeID }
  //     })
  //     .then((res) => res)
  //     .catch((err) => err);
  // };
  getGardenTypeByID = (gardenTypeID: string) => {
    return axios
      .get(`/api/v1/admin/garden-types/${gardenTypeID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create garden type
  createGardenType = (type: GardenType) => {
    const data = {
      name: type.name,
      description: type.description
    };
    axios.post('/api/v1/admin/garden-types', data);
  };

  // update garden type
  updateGardenType = (type: GardenType) => {
    const data = {
      id: type.id,
      name: type.name,
      description: type.description
    };
    axios.put('/api/v1/admin/garden-types', data);
  };

  // delete garden type
  deleteGardenType = (gardenTypeID: string) => {
    // return axios
    //   .delete('/api/v1/admin/garden-types', {
    //     data: { id: gardenTypeID }
    //   })
    //   .then((res) => res)
    //   .catch((err) => err);
    return axios
      .delete(`/api/v1/admin/garden-types/${gardenTypeID}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageGarden = new GardenManager();
