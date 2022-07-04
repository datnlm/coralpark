import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';
import { Cell } from './cell';

export type Garden = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  address: string;
  acreage: number;
  quantityOfCells: number;
  areaId: any;
  gardenTypeId: any;
  siteId: any;
  status: any;
  coralCells: any;
};
export type GardenType = {
  id: string;
  name: string;
  description: string;
};
export type Site = {
  id: string;
  name: string;
  imageUrl: string;
  createTime: any;
  phone: string;
  email: string;
  address: string;
  webUrl: string;
  latitude: string;
  longitude: string;
  status: any;
  listGarden: any;
};
