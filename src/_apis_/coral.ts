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
    return axios
      .delete(`/api/v1/admin/corals/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // getCoralbyID
  getCoralByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/corals/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create coral
  createCoral = (coral: any) => {
    axios.post('/api/v1/admin/corals', coral, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
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
    let data = {};
    if (coralType.level === '1') {
      data = {
        name: coralType.name,
        levelType: coralType.level,
        description: coralType.description
      };
    } else {
      data = {
        name: coralType.name,
        parentId: coralType.parent,
        levelType: coralType.level,
        description: coralType.description
      };
    }
    axios.post('/api/v1/admin/coral-types', data);
  };

  // get coral type
  getCoralType = (ParentID: string) => {
    console.log(ParentID);
    if (ParentID === 'class' || ParentID === 'species') {
      // level type = 1 to get all class
      // level type = 5 to get all species
      const LevelType = ParentID === 'class' ? '1' : '5';
      console.log(LevelType);
      return axios
        .get('/api/v1/admin/coral-types', {
          params: { LevelType }
        })
        .then((res) => res)
        .catch((err) => err);
    }
    return axios
      .get('/api/v1/admin/coral-types', {
        params: { ParentID }
      })
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageCoral = new Coral();
