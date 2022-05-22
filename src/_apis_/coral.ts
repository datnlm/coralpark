import axios from 'axios';
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
  deleteCoral = (id: string) => {
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
    return axios
      .post('/api/v1/admin/corals', coral, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  updateCoral = (coral: any) => {
    return axios
      .put('/api/v1/admin/corals', coral, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get list coral type
  getListCoralType = () => {
    return axios
      .get('/api/v1/admin/coral-types')
      .then((res) => res)
      .catch((err) => err);
  };

  // get list coral phases
  getListCoralPhases = () => {
    return axios
      .get('/api/v1/admin/coral-phases')
      .then((res) => res)
      .catch((err) => err);
  };

  createCoralPhases = (phases: any) => {
    return axios
      .post('/api/v1/admin/coral-phases', phases, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  updateCoralPhases = (phases: any) => {
    return axios
      .put('/api/v1/admin/coral-phases', phases, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get list coral phases
  getListCoralPhasesTypes = () => {
    return axios
      .get('/api/v1/admin/coral-phase-types')
      .then((res) => res)
      .catch((err) => err);
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
      coral: phaseType.coralID.id,
      coralPhases: phaseType.phaseID.id
    };
    return axios
      .post('/api/v1/admin/coral-phase-types', data)
      .then((res) => res)
      .catch((err) => err);
  };

  updateCoralPhasesType = (phaseType: PhasesType) => {
    const data = {
      id: phaseType.phaseID,
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
    return axios
      .post('/api/v1/admin/coral-phase-types', data)
      .then((res) => res)
      .catch((err) => err);
  };

  createCoralType = (coralType: CoralType) => {
    console.log(coralType);
    let data = {};
    if (coralType.levelType == '1') {
      data = {
        name: coralType.name,
        levelType: coralType.levelType,
        description: coralType.description
      };
    } else {
      data = {
        name: coralType.name,
        parentId: coralType.parentId,
        levelType: coralType.levelType,
        description: coralType.description
      };
    }
    return axios
      .post('/api/v1/admin/coral-types', data)
      .then((res) => res)
      .catch((err) => err);
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

  createHabitat = (habitat: any) => {
    const data = {
      bathymetry: habitat.bathymetry,
      temperature: habitat.temperature,
      brightness: habitat.brightness,
      tides: habitat.tides,
      current: habitat.current,
      coralId: habitat.id
    };
    axios.post('/api/v1/admin/habitats', data);
  };
}
export const manageCoral = new Coral();
