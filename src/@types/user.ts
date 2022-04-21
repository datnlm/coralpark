// ----------------------------------------------------------------------

import { FormikProps } from 'formik';
import { type } from 'os';
import internal from 'stream';
import { StringLocale } from 'yup/lib/locale';

export type UserInvoice = {
  id: string;
  createdAt: Date;
  price: number;
};

export type CreditCard = {
  id: string;
  cardNumber: string;
  cardType: string;
};

export type Follower = {
  id: string;
  avatarUrl: string;
  name: string;
  country: string;
  isFollowed: boolean;
};

export type Gallery = {
  id: string;
  title: string;
  postAt: Date;
  imageUrl: string;
};

export type UserAddressBook = {
  id: string;
  name: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
};

export type Profile = {
  id: string;
  cover: string;
  position: string;
  follower: number;
  following: number;
  quote: string;
  country: string;
  email: string;
  company: string;
  school: string;
  role: string;
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;
};

export type UserManager = {
  id: string;
  name: string;
  scientific: string;
  logevity: string;
  country: string;
  exhibit: string;
  current: string;
  sexual: string;
  nutrition: string;
  colour: string;
  type: string;
  habital: string;
  bathymetry: string;
  temperature: string;
  brightness: string;
  tides: string;
  images: string[];
  description: string;
};

export type CoralType = {
  name: string;
  parent: string;
  level: string;
  description: string;
};

export type UserData = {
  id: string;
  avatarUrl: string;
  cover: string;
  name: string;
  follower: number;
  following: number;
  totalPost: number;
  position: string;
};

export type NotificationSettings = {
  activityComments: boolean;
  activityAnswers: boolean;
  activityFollows: boolean;
  applicationNews: boolean;
  applicationProduct: boolean;
  applicationBlog: boolean;
};

export type Friend = {
  id: string;
  avatarUrl: string;
  name: string;
  role: string;
};

export type UserPost = {
  id: string;
  author: {
    id: string;
    avatarUrl: string;
    name: string;
  };
  isLiked: boolean;
  createdAt: Date;
  media: string;
  message: string;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    author: {
      id: string;
      avatarUrl: string;
      name: string;
    };
    createdAt: Date;
    message: string;
  }[];
};

export type AccountBillingFormikProps = FormikProps<{
  cardName: string;
  cardNumber: string;
  cardExpired: string;
  cardCvv: string;
}>;

//Coral park
export type CoralArea = {
  coralId: string;
  areanID: string;
};
export type AreaProvice = {
  id: number;
  name: string;
  country: string;
};

//Coral type
export type Coral = {
  id: number;
  name: string;
  imageUrl: string;
  scientificName: string;
  longevity: number;
  exhibitSocial: string;
  sexualBehaviors: string;
  nutrition: string;
  colour: string;
  description: string;
  coralTypeId: number;
  status: number;
  statusEnum: string;
  className: String;
  orderName: String;
  familyName: String;
  genusName: String;
  speciesName: string;
};
export type PhasesType = {
  minWeight: string;
  maxWeight: string;
  minHigh: string;
  maxHigh: string;
  timeForm: string;
  timeTo: string;
  coulour: string;
  coralID: string;
  phaseID: string;
};
export type Phases = {
  name: string;
  description: string;
};
export type Area = {
  id: string;
  address: string;
  wardCode: string;
};
