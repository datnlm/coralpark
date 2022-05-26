import axios from 'axios';
import { CoralType, Phases, PhasesType, CoralArea } from '../@types/coral';

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

  // delete coral type
  deleteCoralType = (id: string) => {
    return axios
      .delete(`/api/v1/admin/coral-types/${id}`)
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
    const page_size = 50;
    return axios
      .get('/api/v1/admin/coral-types', {
        params: { page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get coral type by id
  getCoralTypeByID = (coralTypeId: string) => {
    return axios
      .get(`/api/v1/admin/coral-types/${coralTypeId}`)
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
      coral: { id: phaseType.coralID.id },
      coralPhase: { id: phaseType.phaseID.id }
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

  // create coral type
  createCoralType = (coralType: CoralType) => {
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

  //  update coral type
  updateCoralType = (coralType: CoralType) => {
    let data = {};
    if (coralType.levelType == '1') {
      data = {
        id: coralType.id,
        name: coralType.name,
        levelType: coralType.levelType,
        description: coralType.description
      };
    } else {
      data = {
        id: coralType.id,
        name: coralType.name,
        parentId: coralType.parentId,
        levelType: coralType.levelType,
        description: coralType.description
      };
    }
    return axios
      .put('/api/v1/admin/coral-types', data)
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
      coral: { id: habitat.coralId }
    };
    return axios
      .post('/api/v1/admin/habitats', data)
      .then((res) => res)
      .catch((err) => err);
  };

  updateHabitat = (habitat: any) => {
    const data = {
      id: habitat.habitatId,
      bathymetry: habitat.bathymetry,
      temperature: habitat.temperature,
      brightness: habitat.brightness,
      tides: habitat.tides,
      current: habitat.current,
      coral: { id: habitat.coralId }
    };
    return axios
      .put('/api/v1/admin/habitats', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // get habitat by coral id
  getHabitatByCoralId = (coralId: string) => {
    return axios
      .get(`/api/v1/admin/habitats/coral/${coralId}`)
      .then((res) => res)
      .catch((err) => err);
  };

  createCoralArea = (coralArea: CoralArea) => {
    const data = {
      coral: { id: coralArea.coral },
      area: { id: coralArea.area }
    };
    return axios
      .post('/api/v1/admin/coral-areas', data)
      .then((res) => res)
      .catch((err) => err);
  };

  updateCoralArea = (coralArea: CoralArea) => {
    const data = {
      id: coralArea.id,
      coral: { id: coralArea.coral.id },
      area: { id: coralArea.area.id }
    };
    return axios
      .put('/api/v1/admin/coral-areas', data)
      .then((res) => res)
      .catch((err) => err);
  };

  deleteCoralArea = (id: string) => {
    return axios
      .delete(`/api/v1/admin/coral-areas/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageCoral = new Coral();
