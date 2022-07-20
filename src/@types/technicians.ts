import { Area } from './area';

export type Technician = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  imageUrl: string;
  status: any;
  areas: Area[];
};

export type TechnicianArea = {
  area: any;
  technicianId: string;
};
