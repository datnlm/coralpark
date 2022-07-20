import { Area } from "./area";

export type Diver = {
  id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  imageUrl: string;
  status: any;
};

export type DiverTeam = {
  id: string;
  name: string;
  number: string;
  divers: Diver[];
  areas: Area[];
  status: any;
};

export type DiverTeamArea = {
  diverTeam: DiverTeam | null;
  area: any;
};
