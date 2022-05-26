// ----------------------------------------------------------------------

import { FormikProps } from 'formik';
// export type CoralType = {
//   name: string;
//   parent: string;
//   level: string;
//   description: string;
// };

export type AccountBillingFormikProps = FormikProps<{
  cardName: string;
  cardNumber: string;
  cardExpired: string;
  cardCvv: string;
}>;

//Coral park

export type Area = {
  id: string;
  name: string;
  address: string;
  wellKnownText: string;
};
