import {
	Request,
	Response
} from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const PieceController = {

    getPieces: async (req: Request, res: Response) => {

        try {
            const pieces = await prisma.pieces.findMany()
            res.status(200).json(pieces)

        } catch (error) {
            console.error(error)
            res.json({ msg: 'erreur interne du seveur' })
        }

    },
    getOnePiece: async (req: Request, res: Response) => {

        try {
            const { id } = req.params
            const onePiece = await prisma.pieces.findUnique({
                where: {
                    idPiece: id
                }
            })
            if (!onePiece) return res.status(404).json({ msg: 'utilisateur non trouvé' })
            res.status(200).json(onePiece)

        } catch (error) {
            console.error(error)
            res.json({ msg: 'erreur interne du seveur' })
        }

    },
    createPiece: async (req: Request, res: Response) => {

        try {

            const {
                nomPiece,
                typePiece,
                description,
                prix,
                quantite } = req.body

            const newUSer = await prisma.pieces.create({
                data: {
                    nomPiece,
                    typePiece,
                    description,
                    prix,
                    quantite,
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
    UpdateUser: async (req:Request, res:Response) => {
        try {
            const { id } = req.params;
            const {
                nomPiece,
                typePiece,
                description,
                prix,
                quantite } = req.body
    
            const updatedPiece = await prisma.pieces.update({
                where: {
                    idPiece: id
                },
                data: {
                    nomPiece,
                    typePiece,
                    description,
                    prix,
                    quantite,
                }
            });
            res.status(200).json(updatedPiece);
    
        } catch (error) {
            console.error(error);
            res.json({ msg: 'Erreur interne du serveur' });
        }
    },
    deleteUser: async (req:Request, res:Response)=> {
        try {
            const { id } = req.params;
    
            const deletedUser = await prisma.pieces.delete({
                where: {
                    idPiece: id
                }
            });
    
            if (!deletedUser) return res.status(404).json({ msg: 'aucun élément trouvé' });
            res.status(200).json({ msg: 'élément supprimé avec succes' });
    
        } catch (error) {
            console.error(error);
            res.json({ msg: 'Erreur interne du serveur' });
        }
    }
    
        
}
export default PieceController;