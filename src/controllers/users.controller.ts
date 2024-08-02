import bcrypt from 'bcrypt';
import {
  Request,
  Response,
} from 'express';

import { PrismaClient } from '@prisma/client';

import { HasherLePass } from '../core/config/fonctionHashage';
import mytokens from '../core/config/tokens';
import { HttpCode } from '../core/constants';
import { CustomRequest } from '../core/middleware/user.middleware';

const prisma = new PrismaClient();

const UserControllers = {


    //creation d'un nouvel utilisateur
    createuser: async (req: Request, res: Response) => {

        try {
            const { name, email, password } = req.body

            const passwordhash = await HasherLePass(password)

            const newuser = await prisma.utilisateurs.create({
                data: {
                    nom: name,
                    email,
                    password: passwordhash
                },
                select: {
                    userID: true,
                    nom: true,
                    email: true,
                    empruntIDs:true,
                    emprunt:true,
                    notificationIDs:true,
                    notification:true,
                }
            })
            res.json(newuser).status(HttpCode.CREATED)
        } catch (error) {
            console.error(error)
        }
    },
    //voir les utilisateurs de la bd
    getusers: async (req: Request, res: Response) => {


        try {
            const users = await prisma.utilisateurs.findMany({
                select: {
                    userID: true,
                    nom: true,
                    email: true,
                    empruntIDs: true,
                    emprunt: true,
                    notificationIDs: true,
                    notification: true,
                }
            });
            if (!users) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Aucun utilisateur trouvé" })
            }
            res.status(HttpCode.OK).json(users);
        } catch (error) {
            console.error(error)
        }
    },
    getUser: async (req: Request, res: Response) => {

        try {

            const { id } = req.params
            const user = await prisma.utilisateurs.findUnique({
                where: {
                    userID: id,
                },
                select: {
                    userID: true,
                    nom: true,
                    email: true,
                    empruntIDs: true,
                    emprunt: true,
                    notificationIDs: true,
                    notification: true,

                }
            })
            if (!user) {
                return res.status(HttpCode.NOT_FOUND).json({ message: "Utilisateur non trouvé" })
            }
            res.status(HttpCode.OK).json(user)
        } catch (error) {
            console.error(error)
        }

    },
    //connexion de l'utilisateur
    loginUser: async (req: Request, res: Response) => {

        try {
            const { email, password } = req.body
            const user = await prisma.utilisateurs.findUnique({
                where: {
                    email
                }
            })
            if (user) {
                const comparePass = await bcrypt.compare(password, user.password)// veryfication du mot de passe 
                if (comparePass) {
                    // generation du token d'acces
                    const accessToken = mytokens.generateAccessToken(user);
                    const refreshToken = mytokens.generateRefreshToken(user);
                    // création du refresh token

                    res.cookie("exbibliofeco", refreshToken, { httpOnly: true, secure: true , maxAge: 30 * 24 * 60 * 60 * 1000})
                    res.header('Authorization', accessToken)
                    res.json({ msg: "connection reussie" })
                    console.log(accessToken)
                }
                else {
                    res.status(HttpCode.UNAUTHORIZED).json({ msg: "mot de passe incorrecte" })
                }
            }// else{ res.json({msg:"cet utilisateur n'existe pas"}).status(HttpCode.NOT_FOUND)}

        } catch (error) {
            console.error(error)
        }


    },
    RefreshAtoken: async (req: CustomRequest, res: Response) => {
        try {
          const user = req.user;
          const payload = { ...user };
    
          delete payload.exp;
          res.cookie("exbibliofeco", payload, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
          });
          const access_token = await mytokens.generateAccessToken(payload);
          res.status(HttpCode.OK).json(access_token);
        } catch (error) {
          console.error(error);
          res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
            message: error
          });
        }
    },
    //Déconnexion de l'utilisateur
    logOut: async (req: Request, res: Response) => {
        try {
          // Supprimer le cookie de refresh token
          res.clearCookie("exbibliofeco", {
            httpOnly: true,
            secure: true,
          });
          res.status(HttpCode.OK).json({ message: "Vous êtes déconnecté" });
        } catch (error) {
          console.error(error);
          res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
            msg: "Une erreur est survenue lors de la déconnexion",
          });
        }
      },
      //mise a jour des informations de l'utilisateur
      updateUser: async (req: CustomRequest, res: Response) => {
        try {
          const user = req.user
          const  id  = user.payload.userID;
          const { name, email, password } = req.body
          const passwordhash = await HasherLePass(password)
         
          const updatedUser = await prisma.utilisateurs.update({
            where: {
              userID: id,
            },
            data: {
              nom: name,
              email,
              password: passwordhash
            },
          })
         
            
          if (!updatedUser) {
            return res.status(HttpCode.NOT_FOUND).json({ message: "Utilisateur non trouvé" })
          }
          res.status(HttpCode.OK).json({msg:"l'utilisateur a été modifier avec succès"})
        } catch (error) {
          console.error(error)
        }
      },
      //suppression d'un utilisateur
      deleteUser : async (req:CustomRequest, res:Response)=>{
         
      }
}

export default  UserControllers