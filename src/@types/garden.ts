import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';

export type Garden = {
  id: string;
  name: string;
  latitude: string
  longitude: string,
  address: string;
  acreage: string;
  quantityOfCells: string;
  areaID: any;
  gardenTypeId: any;
  siteId: any;
  status: number;
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
};
