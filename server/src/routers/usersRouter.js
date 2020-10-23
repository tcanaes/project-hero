import express from 'express';

import * as usersController from '../Controllers/usersController.js';

const router = express.Router();

router.route('/signUp').post(usersController.createNewUser);
router.route('/login').post(usersController.userLogin);

export default router;
