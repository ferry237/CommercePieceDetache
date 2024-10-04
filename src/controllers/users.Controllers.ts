import bcrypt from 'bcrypt';
import {
	Request,
	Response
} from 'express';

import { PrismaClient } from '@prisma/client';

import { HasherLePass } from '../core/config/fonctionHashage';

const prisma = new PrismaClient()

const UserController = {
    // obtenir la les informations de tous les utilisateurs 
    getUsers: async (req: Request, res: Response) => {

        try {
            const users = await prisma.utilisateur.findMany()
            res.status(200).json(users)

        } catch (error) {
            console.error(error)
            res.json({ msg: 'erreur interne du seveur' })
        }

    },

    // obtenir les informations d'un utilisateur
    getOneUser: async (req: Request, res: Response) => {

        try {
            const { id } = req.params
            const oneUser = await prisma.utilisateur.findUnique({
                where: {
                    idUser: id
                }
            })
            if (!oneUser) return res.status(404).json({ msg: 'utilisateur non trouvé' })
            res.status(200).json(oneUser)

        } catch (error) {
            console.error(error)
            res.json({ msg: 'erreur interne du seveur' })
        }

    },
    // creation d'utilisateur 

    createUser: async (req: Request, res: Response) => {

        try {

            const {
                nomUser, prenomUser, emailUser, passwordUser, statusUser, telephone } = req.body

            const passwordhash = await HasherLePass(passwordUser)
            //appel de la fonction de hachage du mot de pass

            const newUSer = await prisma.utilisateur.create({
                data: {
                    nomUser,
                    prenomUser,
                    emailUser,
                    passwordUser: passwordhash,
                    statusUser,
                    telephone,
                }
            })
            console.log("utilisateur créer")
            res.status(200).json(newUSer)

        }
        catch (error) {

            console.error(error)
            res.json({ msg: 'erreur interne du seveur' })
        }
    },

    UpdateUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const {
                nomUser, prenomUser, emailUser, passwordUser, statusUser, telephone
            } = req.body;

            const updatedUser = await prisma.utilisateur.update({
                where: {
                    idUser: id
                },
                data: {
                    nomUser,
                    prenomUser,
                    emailUser,
                    passwordUser,
                    statusUser,
                    telephone
                }
            });

            if (!updatedUser) return res.status(404).json({ msg: 'Utilisateur non trouvé' });
            res.status(200).json(updatedUser);

        } catch (error) {
            console.error(error);
            res.json({ msg: 'Erreur interne du serveur' });
        }
    },
    deleteUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const deletedUser = await prisma.utilisateur.delete({
                where: {
                    idUser: id
                }
            });

            if (!deletedUser) return res.status(404).json({ msg: 'Utilisateur non trouvé' });
            res.status(200).json({ msg: 'Utilisateur supprimé' });

        } catch (error) {
            console.error(error);
            res.json({ msg: 'Erreur interne du serveur' });
        }
    },
    // login de l'utilisateur 
    loginUser: async (req: Request, res: Response) => {

        try {
            const { email, password } = req.body
            const user = await prisma.utilisateur.findUnique({
                where: {
                    emailUser: email
                }
            })
            if (user) {
                //comparaison du mot de pass entrer par l'utilisateur avec celui de la base de donnée 

                const comparePass = await bcrypt.compare(password, user.passwordUser)// veryfication du mot de passe 
                if (comparePass) {

                    res.json({ msg: "connection reussie" })

                }
                else {
                    res.status(401).json({ msg: "mot de passe incorrecte" })
                }
            }
        } catch (error) {
            console.error(error)
        }


    },

}

export default UserController;