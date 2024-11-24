import { UserType } from './userType';

export class User {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  userTypeName: UserType;

  constructor() {
    this.userId = 0;
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.userTypeName = 'Unk';
  }
}
