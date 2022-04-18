import axios from 'axios';
import { apiCon } from './api';
import { CoralType, Phases, PhasesType } from '../@types/user';

export class Coral {
  // get list coral
  getListCoral = () => {
    return axios({
      url: 'http://104.45.197.106:8080/api/v1/admin/corals',
      method: 'GET'
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
      parent: coralType.parent,
      level: coralType.level,
      description: coralType.description
    };
    return axios({
      url: `${apiCon.host}admin/coral-types/`,
      method: 'POST',
      data: dt
    });
  };
}
export const manageCoral = new Coral();
