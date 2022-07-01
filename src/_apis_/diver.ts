import axios from 'axios';
import { Diver, DiverTeamArea } from '../@types/diver';

export class DiverManager {
  // get list diver
  getListDiver = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/divers', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get diver by id
  getDiverByID = (diverID: string) => {
    return axios
      .get(`/api/v1/admin/divers/${diverID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create diver
  createDiver = (diver: any) => {
    return axios
      .post('/api/v1/admin/divers', diver, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // update diver
  updateDiver = (diver: any) => {
    return axios
      .put('/api/v1/admin/divers', diver, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => response)
      .catch((err) => err);
  };

  // delete diver
  deleteDiver = (diverID: string) => {
    return axios
      .delete(`/api/v1/admin/divers/${diverID}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // get list diver team
  getListDiverTeam = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/diver-teams', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // create diver team
  createDiverTeam = (diverTeam: any) => {
    const data = {
      name: diverTeam.name,
      number: diverTeam.divers.length,
      divers: diverTeam.divers
    };
    return axios
      .post('/api/v1/admin/diver-members/divers', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // update diver team
  updateDiverTeam = (diverTeam: any) => {
    const data = {
      id: diverTeam.id,
      name: diverTeam.name,
      number: diverTeam.divers.length,
      status: diverTeam.status,
      divers: diverTeam.divers
    };
    return axios
      .put('/api/v1/admin/diver-members/divers', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // get diver by id
  getDiverTeamByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/diver-teams/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // delete diver team
  deleteDiverTeam = (id: string) => {
    return axios
      .delete(`/api/v1/admin/diver-teams/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  createDiverTeamArea = (diverTeamArea: DiverTeamArea) => {
    const data = {
      diverTeams: diverTeamArea.diverTeams,
      id: diverTeamArea.area.id,
      name: diverTeamArea.area.name,
      wellKnownText: diverTeamArea.area.wellKnownText,
      address: diverTeamArea.area.address
    };
    return axios
      .post('/api/v1/admin/diver-team-areas/divers', data)
      .then((res) => res)
      .catch((err) => err);
  };

  updateDiverTeamArea = (diverTeamArea: DiverTeamArea) => {
    const data = {
      diverTeams: diverTeamArea.diverTeams,
      id: diverTeamArea.area.id,
      name: diverTeamArea.area.name,
      wellKnownText: diverTeamArea.area.wellKnownText,
      address: diverTeamArea.area.address
    };
    return axios
      .put('/api/v1/admin/diver-team-areas/divers', data)
      .then((res) => res)
      .catch((err) => err);
  };

  deleteDiverTeamArea = (id: string) => {
    return axios
      .delete(`/api/v1/admin/diver-team-areas/divers/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageDiver = new DiverManager();
