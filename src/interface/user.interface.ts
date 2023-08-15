/* eslint-disable prettier/prettier */
export class UserInterface {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  company?: string;
  role: 'individual' | 'organization';
  jobTitle?: string; 
  isVerified: boolean;
  google?: {
    accessToken: string;
    email: string;
    profileId: string;
  };
  facebook?: {
    accessToken: string;
    email: string;
    profileId: string;
  };
  avatar: string;
  emailVerificationTokenExpiresAt: Date;
  dateCreated: Date;
  dateUpdated: Date;
  profile: any;
}
