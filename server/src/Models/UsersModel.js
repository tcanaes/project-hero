import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

class Users {
  constructor() {
    console.log('--> Users.constructor');
    this.usersFileName = path.join(__dirname, '/src/Data/users.json');
    this.UsersList = [];
    this.LoggedUsers = [];

    /*Load User Files*/
    this.loadUsersFile();
  }

  /* FILE CONTROL */
  loadUsersFile = async () => {
    console.log('--> Users.loadUsersFile');
    const fileData = fs.readFileSync(this.usersFileName, 'utf-8');
    if (fileData.length > 0) this.UsersList = JSON.parse(fileData);
  };

  updateUsersFile = async () => {
    const data = JSON.stringify(this.UsersList);
    fs.writeFileSync(this.usersFileName, data);
  };

  /* USER SIGN UP */
  newUserSignUp = (newUser) => {
    const usersList = this.UsersList['users'];

    /*check if user already exist*/
    let user = usersList.find((user) => {
      return user.username === newUser.username;
    });

    /* if it doesnt exist, create */
    if (user) return undefined;

    this.UsersList['users'].push(newUser);
    this.updateUsersFile();
    user = newUser;
    return { status: 'ok', user };
  };

  /* USER LOGIN */
  userLogin = (username) => {
    const usersList = this.UsersList['users'];

    /*check if user already exist*/
    let user = usersList.find((user) => {
      return user.username === username;
    });
    console.log('user found: ', user);

    /*if not found, return error */
    if (!user) return undefined;

    /*check if already logged in*/

    let loggedIn = this.isLoggedIn(username);
    const token = loggedIn ? loggedIn.token : Date.now() * 1;
    const login = {
      username,
      token,
    };
    this.LoggedUsers.push(login);
    return token + '';
  };

  /*Check if user is logged in*/
  isLoggedIn = (username) => {
    return this.LoggedUsers.find((user) => {
      return user.username === username;
    });
  };

  /*User Disconnected*/
  disconnected = (username) => {
    const index = this.LoggedUsers.indexOf(username);
    if (index >= 0) this.LoggedUsers.splice(index, 1);
    return true;
  };
}

const users = new Users();
export default users;
