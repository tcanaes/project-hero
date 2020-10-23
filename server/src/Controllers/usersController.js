import Users from '../Models/UsersModel.js';

/******************************************************************************/
/*                                USER SIGNUP                                 */
/******************************************************************************/
const createNewUser = async (req, res, next) => {
  const { username, password } = req.body;
  const newUser = { username };
  console.log('=> New username to be created: ', newUser);
  const user = Users.newUserSignUp(newUser);
  if (user) {
    res.status(200).json({ status: 'ok', user });
  } else {
    res.status(404).json({ status: 'fail', message: `User already created.` });
  }
};

/******************************************************************************/
/*                                USER LOGIN                                  */
/******************************************************************************/
const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  console.log('=> user to login: ', username);
  const token = Users.userLogin(username);
  if (token) res.status(200).json({ status: 'ok', token });
  else res.status(400).json({ status: 'fail', message: 'Login forbidden!' });
};

/******************************************************************************/
/*                                  RETURNS                                   */
/******************************************************************************/
export { createNewUser, userLogin };
