import axios from 'axios';
import { Partner, PartnerType } from '../@types/partner';

export class PartnerManager {
  // get list garden
  getListPartner = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/partner', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  // get garden by id
  getPartnerByID = (partnerId: string) => {
    return axios
      .get(`/api/v1/admin/partner/${partnerId}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create garden
  createPartner = (partner: Partner) => {
    const data = {
      name: partner.name,
      phone: partner.phone,
      email: partner.email,
      address: partner.address,
      webUrl: partner.webUrl,
      partnerType: { id: partner.partnerType.id }
    };
    return axios
      .post('/api/v1/admin/partner', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // update garden
  updatePartner = (partner: Partner) => {
    const data = {
      id: partner.id,
      name: partner.name,
      phone: partner.phone,
      email: partner.email,
      address: partner.address,
      webUrl: partner.webUrl,
      partnerType: { id: partner.partnerType.id }
    };
    return axios
      .put('/api/v1/admin/partner', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // delete garden
  deletePartner = (id: string) => {
    return axios
      .delete(`/api/v1/admin/gardens/${id}`)
      .then((res) => res)
      .catch((err) => err);
  };
  //-----------------------------------------------

  // get garden type
  getListPartnerType = (page_number: number, page_size: number) => {
    return axios
      .get('/api/v1/admin/partner-types', {
        params: { page_number, page_size }
      })
      .then((res) => res)
      .catch((err) => err);
  };

  getPartnerTypeByID = (partnerTypeId: string) => {
    return axios
      .get(`/api/v1/admin/partner-types/${partnerTypeId}`)
      .then((res) => res)
      .catch((err) => err);
  };

  // create garden type
  createPartnerType = (type: PartnerType) => {
    const data = {
      name: type.name
    };
    return axios
      .post('/api/v1/admin/partner-types', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // update garden type
  updatePartnerType = (type: PartnerType) => {
    const data = {
      id: type.id,
      name: type.name
    };
    return axios
      .put('/api/v1/admin/partner-types', data)
      .then((res) => res)
      .catch((err) => err);
  };

  // delete garden type
  deletePartnerType = (partnerTypeId: string) => {
    return axios.delete(`/api/v1/admin/partner-types/${partnerTypeId}`).then((res) => res);
  };
}
export const managePartner = new PartnerManager();
