import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';


export type Garden = {
    id: string;
    name: string;
    location: string;
    address: string;
    acreage: number;
    quantityOfCells: number;
    areaID: string;
    gardenTypeId: string;
    gardenOwnerId: string;
    status: string;
};
export type GardenType = {
    id: string;
    name: string;
    description: string;
};