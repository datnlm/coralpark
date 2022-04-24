import axios from 'axios';
import { apiCon } from './api';
import { CoralType, Phases, PhasesType } from '../@types/user';

export class Coral {
  // get list coral
  getListCoral = () => {
    return axios({
      url: 'http://104.45.197.106:8080/api/v1/admin/corals',
      method: 'GET',
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTGUgVGFuIFRydW9uZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InRydW9uZ2x0c2UxNDA5MDNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQUQiLCJuYmYiOjE2NTA0Njc4ODYsImV4cCI6MTY1MDQ3NTA4NiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEifQ.FKYyosI_-sa-9yX4jALJj6UG7dPGeXiFX08qvopPbdM`
      }
    });
  };

  // delete
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

  // getCoralbyID
  getCoralByID = (id: string) => {
    return axios({
      url: `http://104.45.197.106:8080/api/v1/admin/corals/${id}`,
      method: 'GET'
    });
  };

  createCoralPhases = (phases: Phases) => {
    const dt = {
      name: phases.name,
      imageUrl: 'string',
      description: phases.description
    };
    return axios({
      url: `${apiCon.host}admin/coral-phases/`,
      method: 'POST',
      data: dt
    });
  };

  createCoralPhasesType = (phaseType: PhasesType) => {
    const dt = {
      minWeight: phaseType.maxWeight,
      maxWeight: phaseType.maxWeight,
      minHigh: phaseType.minHigh,
      maxHigh: phaseType.maxHigh,
      timeFrom: phaseType.timeForm,
      timeTo: phaseType.timeTo,
      colour: phaseType.coulour,
      coral: phaseType.coralID,
      coralPhases: phaseType.phaseID
    };
    return axios({
      url: `${apiCon.host}admin/coral-phase-types/`,
      method: 'POST',
      data: dt
    });
  };

  createCoralType = (coralType: CoralType) => {
    const dt = {
      name: coralType.name,
      parent: coralType.parentID,
      level: coralType.level,
      description: coralType.description
    };
    return axios({
      url: `${apiCon.host}admin/coral-types/`,
      method: 'POST',
      data: dt
    });
  };

  getCoralType = (parentID: String) => {
    return axios({
      url: `http://104.45.197.106:8080/api/v1/admin/coral-types?ParentID=${parentID}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTGUgVGFuIFRydW9uZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InRydW9uZ2x0c2UxNDA5MDNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQUQiLCJuYmYiOjE2NTA1NTcxNjIsImV4cCI6MTY1MDU2NDM2MiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEifQ.qgEo4EGz_3wy16ko3TpntmkMBXCnpHKPyv2j_NWs2oM`
      }
    });
  };
}
export const manageCoral = new Coral();
