import axios from 'axios';
import { apiCon } from './api';
import { CoralType, Phases, PhasesType } from '../@types/user';

export class Coral {
  // get list coral
  getListCoral = () => {
    return axios
      .get('/api/v1/admin/corals')
      .then((res) => res)
      .catch((err) => err);
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
    return axios
      .get(`/api/v1/admin/corals/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  createCoralPhases = (phases: Phases) => {
    const data = {
      name: phases.name,
      imageUrl: phases.imageUrl,
      description: phases.description
    };
    axios.post('/api/v1/admin/coral-phases', data);
  };

  createCoralPhasesType = (phaseType: PhasesType) => {
    const data = {
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
    axios.post('/api/v1/admin/coral-phase-types', data);
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
