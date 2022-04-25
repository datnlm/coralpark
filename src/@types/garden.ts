import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';

export type Garden = {
  id: string;
  name: string;
  location: string;
  address: string;
  acreage: string;
  quantityOfCells: string;
  areaID: string;
  gardenTypeId: string;
  gardenOwnerId: string;
  staffId: string;
  status: number;
};
export type GardenType = {
  id: string;
  name: string;
  description: string;
};
export type GardenOwner = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  imageUrl: string[];
};
