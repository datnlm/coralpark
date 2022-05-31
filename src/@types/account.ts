// ----------------------------------------------------------------------

export type User = {
  id: string;
  name: string;
  displayName: string;
  email: string;
  password: string;
  photoURL: File | any;
  phoneNumber: string | null;
  country: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  zipCode: string | null;
  about: string | null;
  role: string;
  isPublic: boolean;
  status: string;
};

export type Account = {
  userName: string;
  email: string;
  roleId: string;
  roleName: string;
};
