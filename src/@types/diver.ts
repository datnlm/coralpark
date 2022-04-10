import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';


export type Diver = {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    status: string;
};