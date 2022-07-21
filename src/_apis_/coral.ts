import axios from 'axios';
import coral from 'redux/slices/coral';
import { CoralType, Phases, PhasesType, CoralArea, CoralHealth } from '../@types/coral';

export class Coral {
  // get list coral
  getListCoral = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/corals', {
        params: { page_number, page_size }
      })
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
  getListCoralType = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/coral-types', {
        params: { page_number, page_size }
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
  getListCoralPhases = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/coral-phases', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get coral type by id
  getCoralPhaseByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/coral-phases/${id}`)
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

  // delete coral phase
  deleteCoralPhase = (id: string) => {
    return axios
      .delete(`/api/v1/admin/coral-phases/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // get list coral phases
  getListCoralPhasesTypes = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/coral-phase-types', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  createCoralPhasesType = (phaseForm: any) => {
    const phaseType: any[] = [];
    phaseForm.coralPhaseTypes.map((v: any) => {
      phaseType.push({
        minWeight: v.maxWeight,
        maxWeight: v.maxWeight,
        minHigh: v.minHigh,
        maxHigh: v.maxHigh,
        timeFrom: v.timeFrom,
        timeTo: v.timeTo,
        colour: v.colour,
        coralPhaseId: v.coralPhaseId
      });
    });
    const data = {
      id: phaseForm.id,
      colour: phaseForm!.colour,
      exhibitSocial: phaseForm!.exhibitSocial,
      longevity: phaseForm!.longevity,
      name: phaseForm!.name,
      nutrition: phaseForm!.nutrition,
      scientificName: phaseForm!.scientificName,
      sexualBehaviors: phaseForm!.sexualBehaviors,
      coralTypeId: phaseForm!.coralTypeId,
      coralPhaseTypes: phaseType
    };
    return axios
      .post('/api/v1/admin/coral-phase-types/phasetypes', data)
      .then((res) => res)
      .catch((err) => err);
  };

  updateCoralPhasesType = (phaseForm: any) => {
    const phaseType: any[] = [];
    phaseForm.coralPhaseTypes.map((v: any) => {
      phaseType.push({
        minWeight: v.maxWeight,
        maxWeight: v.maxWeight,
        minHigh: v.minHigh,
        maxHigh: v.maxHigh,
        timeFrom: v.timeFrom,
        timeTo: v.timeTo,
        colour: v.colour,
        coralPhaseId: v.coralPhaseId
      });
    });
    const data = {
      id: phaseForm.id,
      colour: phaseForm!.colour,
      exhibitSocial: phaseForm!.exhibitSocial,
      longevity: phaseForm!.longevity,
      name: phaseForm!.name,
      nutrition: phaseForm!.nutrition,
      scientificName: phaseForm!.scientificName,
      sexualBehaviors: phaseForm!.sexualBehaviors,
      coralTypeId: phaseForm!.coralTypeId,
      coralPhaseTypes: phaseType
    };
    return axios
      .put('/api/v1/admin/coral-phase-types/phasetypes', data)
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
        parentId: '0',
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
        parentId: '0',
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
  getCoralType = (ParentID: string, page_number: number, page_size: number) => {
    console.log(ParentID);
    if (ParentID === 'class' || ParentID === 'species') {
      // level type = 1 to get all class
      // level type = 5 to get all species
      const LevelType = ParentID === 'class' ? '1' : '5';
      console.log(LevelType);
      return axios
        .get('/api/v1/admin/coral-types', {
          params: { LevelType, page_number, page_size }
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
      coralId: habitat.coralId
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
      coralId: habitat.coralId
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
      coralId: coralArea.coral,
      areas: coralArea.area
      // name: technicianArea.area.name,
      // wellKnownText: technicianArea.area.wellKnownText,
      // address: technicianArea.area.address
    };
    return axios
      .post('/api/v1/admin/coral-areas/corals', data)
      .then((res) => res)
      .catch((err) => err);
  };

  updateCoralArea = (coralArea: CoralArea) => {
    const data = {
      id: coralArea.coral?.id,
      name: coralArea.coral?.name,
      colour: coralArea.coral?.colour,
      coralTypeId: coralArea.coral?.coralTypeId,
      exhibitSocial: coralArea.coral?.exhibitSocial,
      longevity: coralArea.coral?.longevity,
      scientificName: coralArea.coral?.scientificName,
      sexualBehaviors: coralArea.coral?.sexualBehaviors,
      nutrition: coralArea.coral?.nutrition,
      areas: coralArea.area
    };
    return axios
      .put('/api/v1/admin/coral-areas/areas', data)
      .then((res) => res)
      .catch((err) => err);
  };

  deleteCoralArea = (id: string) => {
    return axios
      .delete(`/api/v1/admin/coral-areas/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  getListCoralHealth = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/coral-health', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get coral type by id
  getCoralHealthByID = (id: string) => {
    return axios
      .get(`/api/v1/admin/coral-health/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };

  createCoralHealth = (coralHealth: CoralHealth) => {
    const data = {
      name: coralHealth.name
    };
    return axios
      .post('/api/v1/admin/coral-health', data)
      .then((res) => res)
      .catch((err) => err);
  };

  updateCoralHealth = (coralHealth: CoralHealth) => {
    const data = {
      id: coralHealth.id,
      name: coralHealth.name
    };
    return axios
      .put('/api/v1/admin/coral-health', data)
      .then((res) => res)
      .catch((err) => err);
  };

  deleteCoralHealth = (id: string) => {
    return axios
      .delete(`/api/v1/admin/coral-health/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
}
export const manageCoral = new Coral();
