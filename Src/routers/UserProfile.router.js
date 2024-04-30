import { Router } from 'express';
import verifyUserJWT from '../middlerwere/auth.middlewere.js';
import { updateProfile } from "../controllers/UserProfileUpadet.js"
const router = Router()
router.route('/UpdateProfile/user').put(verifyUserJWT, updateProfile);

export default router;
