export class User {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  userTypeName: string;

  constructor() {
    this.userId = 0;
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.userTypeName = '';
  }
}
