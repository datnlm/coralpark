export type Technician = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  imageUrl: string;
  status: any;
  areas: any;
};

export type TechnicianArea = {
  area: any;
  technicians: Technician[];
};
