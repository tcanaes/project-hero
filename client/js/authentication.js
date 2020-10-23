msgAlert = async (message) => {
  const messageSpan = document.getElementById('alert-message');
  messageSpan.innerText = message;
  const messageContainer = document.getElementById('alert-container');
  messageContainer.style.display = 'block';
  setTimeout(() => {
    messageContainer.style.display = 'none';
  }, 2000);
};

/******************************************************************************/
/*                                USER LOGIN                                  */
/******************************************************************************/
joinGame = async (evt) => {
  //Prevent reload
  evt.preventDefault();

  /* Get username from screen*/
  const usernameInput = document.getElementById('username');
  const username = usernameInput.value.trim();
  if (!username.length > 0) return console.log('username em branco...');

  /* CALL API to create new user */
  const usernameObj = {
    username,
    password: '',
  };
  console.log('username login: ', usernameObj);

  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usernameObj),
  });

  if (response.status === 200) {
    const responseBody = await response.json();
    const loginData = {
      username: usernameObj.username,
      token: responseBody.token,
    };
    console.log('user credential: ', loginData);

    //Hide Login Form
    const loginForm = document.getElementById('login-form');
    loginForm.style.display = 'none';

    //Show Canvas
    const gameCanvas = document.getElementById('game-canvas');
    gameCanvas.hidden = false;

    startClient(loginData);
  } else {
    const responseBody = await response.json();
    msgAlert(responseBody.message);
  }
};

/******************************************************************************/
/*                                USER SIGNUP                                 */
/******************************************************************************/
signUp = async (evt) => {
  //Prevent reload
  evt.preventDefault();

  /* Get username from screen*/
  const usernameInput = document.getElementById('username');
  const username = usernameInput.value.trim();
  if (!username.length > 0) return console.log('username em branco...');

  /* CALL API to create new user */
  const usernameObj = {
    username,
    password: '',
  };
  console.log('username a ser criado: ', usernameObj);

  const response = await fetch('http://localhost:3000/auth/signUp', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usernameObj),
  });

  if (response.status === 200) msgAlert('User created!');
  else {
    const responseBody = await response.json();
    msgAlert(responseBody.message);
  }
};

/******************************************************************************/
/*                               ON PAGE LOAD                                 */
/******************************************************************************/
setup = () => {
  console.log('OIIIII');
  const joinButton = document.getElementById('join-btn');
  joinButton.addEventListener('click', joinGame);

  const signButton = document.getElementById('sign-btn');
  signButton.addEventListener('click', signUp);
};

window.addEventListener('load', setup);
