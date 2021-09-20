import { login, showEmployee } from '../controllers/controller.js';

import express from 'express';

const router = express.Router();

router.post('/login', login);
router.get('/showemployee', showEmployee);

export default router;
