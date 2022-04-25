// ----------------------------------------------------------------------

import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';

export type CoralType = {
  name: string;
  parent: string;
  level: string;
  description: string;
};

export type AccountBillingFormikProps = FormikProps<{
  cardName: string;
  cardNumber: string;
  cardExpired: string;
  cardCvv: string;
}>;

//Coral park

export type Area = {
  id: string;
  address: string;
  wardCode: string;
};
