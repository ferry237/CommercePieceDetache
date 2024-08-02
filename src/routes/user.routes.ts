import { Router } from 'express';

import UserControllers from '../controllers/users.controller';
import authMiddleware from '../core/middleware/user.middleware';
import validateInputUser from '../core/middleware/validate.middleware';

const useroute = Router()

 useroute.get('/profile', UserControllers.getusers)
 useroute.get('/user/:id',UserControllers.getUser)
 useroute.post('/signup',validateInputUser.validation ,UserControllers.createuser)
 useroute.post('/login', UserControllers.loginUser)
 useroute.post('/refresh',authMiddleware.decodeRefreshToken ,UserControllers.RefreshAtoken)
 useroute.post('/logout', UserControllers.logOut)
 useroute.put('/profile',authMiddleware.decodeAccessToken,UserControllers.updateUser)
 useroute.delete('/profile',authMiddleware.decodeAccessToken,UserControllers.deleteUser)

 export default useroute