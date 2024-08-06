import {
  Request,
  Response,
} from 'express';

import { PrismaClient } from '@prisma/client';

import sendmail from '../core/config/sendmail';
import { HttpCode } from '../core/constants';

const prisma = new PrismaClient();

const emprunController = {

    emprunLivre: async (req: Request, res: Response) => {

        try {
            const { livreID, userID } = req.body

            const livre = await prisma.livres.findUnique({
                where: {
                    livreID
                }
            })
            if (!livre) {

                res.json({ msg: "le livre cherché n'existe pas" }).status(HttpCode.NO_CONTENT)
            }
            if (livre?.etat === "EMPRUNTE") { res.json({ msg: "le livre a été emprunté" }) }
            //creation de l'emprunt 

            const newloan = await prisma.emprunt.create({

                data: {

                    livreIDs: [livreID],
                    userIDs: [userID],
                    dateEmprunt: new Date(),
                    dateRetour: new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)),
                },

            })
            await prisma.livres.update({
                where: {
                    livreID,
                },
                data: {
                    etat: 'EMPRUNTE',
                },
            });

            res.json(newloan).status(HttpCode.CREATED)

        } catch (error) {
            console.error(error);

        }


    },
    retourBook: async (req: Request, res: Response) => {

        try {
            // Récupérer l'emprunt par son ID
            const { id } = req.params
                const loan = await prisma.emprunt.findUnique({
                    where: {
                        empruntID: id,
                    },
                    include: {
                        livre: true,
                        users: true
                    
                    },
                });

                if (!loan) {
                    return res.status(HttpCode.NOT_FOUND).json({ error: 'Emprunt non trouvé' });
                }

                // Mettre à jour l'état du livre à "disponible"
                for (const book of loan.livre) {
                    await prisma.livres.update({
                      where: {
                        livreID: book.livreID,
                      },
                      data: {
                        etat: 'DISPONIBLE',
                      },
                    });
                  }

                // Mettre à jour l'emprunt pour marquer qu'il est terminé
                const updatedLoan = await prisma.emprunt.update({
                    where: {
                        empruntID: id,
                    },
                    data: {
                        dateRetour: new Date(),
                    },
                });
                res.status(HttpCode.OK).json(updatedLoan);
                //envoie du mail
                const Users = loan.users
                const book =loan.livre
                const bookTitles = book.map((b) => b.titre);
                const userEmail = Users[0].email;
                const userid:string=Users[0].userID;
                const bookid:string=book[0].livreID
                const msg=`les livres que vous avez empruntés ont bien été reçu il sagit des livres suivant: ${bookTitles},`
                const subject:string=`confirmation de reception des livres remis`
                sendmail(userEmail,msg,subject);

                await prisma.notification.create({
                    data: {
                       utilisateurID:userid,
                       livreID:bookid,
                        message: msg,
                        date: new Date()
                      },
                })
            } 
            catch (error) {
                console.error(error);
                res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: 'Une erreur est survenue lors du retour du livre' });
            }
        },
    historiqueBook: async (req:Request, res:Response)=>{

        const { userID } = req.params;

  try {
    // Récupérer tous les emprunts de l'utilisateur
    const loans = await prisma.emprunt.findMany({
      where: {
        userIDs: {
          has: userID,
        },
      },
      include: {
        livre: true,
      },
    });

    res.status(HttpCode.OK).json(loans);
  } catch (error) {
    console.error(error);
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ error: 'Une erreur est survenue' });
  }
    }
    }
export default emprunController