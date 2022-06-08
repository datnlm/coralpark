import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';

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
  status: any;
};

export type DiverTeamArea = {
  id: string;
  area: any;
  diverTeams: any;
};
