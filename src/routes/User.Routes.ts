import { Router } from 'express';

import UserController from '../controllers/users.Controllers';

const RouteUser = Router ();

//obtenir les utiliseteurs de la base de donnée

 RouteUser.get('/users', UserController.getUsers)
 RouteUser.get('/user/:id', UserController.getOneUser)
 // création d'un utilisateur
 RouteUser.post('/users', UserController.createUser)
 //login de l'utilisateur 
 RouteUser.post('/user/login', UserController.loginUser)
 //modification d'un user 
 RouteUser.put('/user/:id', UserController.UpdateUser)
 RouteUser.delete('/user/:id', UserController.deleteUser)


export default RouteUser