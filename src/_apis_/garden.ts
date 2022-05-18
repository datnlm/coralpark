import axios from 'axios';
import { Garden, Site, GardenType } from '../@types/garden';

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
      latitude: garden.latitude,
      longitude: garden.longitude,
      address: garden.address,
      acreage: garden.acreage,
      quantityOfCells: garden.quantityOfCells,
      areaID: garden.areaID.id,
      gardenTypeId: garden.gardenTypeId.id,
      siteId: garden.siteId.id,
      status: 1
    };
    return axios
      .post('/api/v1/admin/gardens', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // update garden
  updateGarden = (garden: Garden) => {
    const data = {
      id: garden.id,
      name: garden.name,
      latitude: garden.latitude,
      longitude: garden.longitude,
      address: garden.address,
      acreage: garden.acreage,
      quantityOfCells: garden.quantityOfCells,
      areaID: garden.areaID.id,
      gardenTypeId: garden.gardenTypeId.id,
      siteId: garden.siteId.id,
      status: garden.status
    };
    return axios
      .put('/api/v1/admin/gardens', data)
      .then((res) => res)
      .catch((err) => err);
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
  getListSites = () => {
    return axios
      .get('/api/v1/admin/site')
      .then((res) => res)
      .catch((err) => err);
  };

  // get site by id
  getSiteByID = (siteId: string) => {
    return axios
      .get(`/api/v1/admin/site/${siteId}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create site
  createSite = (site: any) => {
    return axios
      .post('/api/v1/admin/site', site, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // update garden owner
  updateSite = (site: any) => {
    return axios
      .put('/api/v1/admin/site', site, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // delete garden owner
  deleteSite = (siteId: string) => {
    return axios
      .delete(`/api/v1/admin/site/${siteId}`)
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
    return axios
      .post('/api/v1/admin/garden-types', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // update garden type
  updateGardenType = (type: GardenType) => {
    const data = {
      id: type.id,
      name: type.name,
      description: type.description
    };
    return axios
      .put('/api/v1/admin/garden-types', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // delete garden type
  deleteGardenType = (gardenTypeID: string) => {
    // return axios
    //   .delete('/api/v1/admin/garden-types', {
    //     data: { id: gardenTypeID }
    //   })
    //   .then((res) => res)
    //   .catch((err) => err);
    return axios.delete(`/api/v1/admin/garden-types/${gardenTypeID}`).then((res) => res);
  };
}
export const manageGarden = new GardenManager();
