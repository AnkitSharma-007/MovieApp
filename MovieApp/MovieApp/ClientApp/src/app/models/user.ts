export class User {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  userTypeName: string;
  isLoggedIn: boolean;

  constructor() {
    this.userId = 0;
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.userTypeName = '';
    this.isLoggedIn = false;
  }
}
