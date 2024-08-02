import {
  Request,
  Response,
} from 'express';

import { PrismaClient } from '@prisma/client';

import { HttpCode } from '../core/constants';

const prisma = new PrismaClient();

const BookControllers = {

  getbooks: async (req: Request, res: Response) => {

    try {

      const books = await prisma.livres.findMany()
      res.json(books).status(HttpCode.OK)

    } catch (error) {
      console.error(error);
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur" })
    }
  },
  createbooks: async (req: Request, res: Response) => {

    try {

      const { titre, auteur, description, anneePublication, ISBN } = req.body
      const publication = parseInt(anneePublication);
      if (isNaN(publication)) {
        return res
          .status(HttpCode.BAD_REQUEST)
          .json({ msg: "L'année de publication doit être un nombre entier" });
      }

      const newBook = await prisma.livres.create({
        data: {
          titre,
          auteur,
          description,
          anneePubli: publication,
          ISBN
        }
      })
      res.json(newBook).status(HttpCode.CREATED)

    } catch (error) {
      console.error(error)
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ msg: "Erreur interne du serveur" })
    }
  },
  updateBooks: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { titre, auteur, description, anneePublication, ISBN } = req.body;

      const publicationYear = parseInt(anneePublication);
      if (isNaN(publicationYear)) {
        return res
          .status(HttpCode.BAD_REQUEST)
          .json({ message: "L'année de publication doit être un nombre entier" });
      }

      const updatedBook = await prisma.livres.update({
        where: {
          livreID: id
        },
        data: {
          titre,
          auteur,
          description,
          anneePubli: publicationYear,
          ISBN,
        },
      });
      res.status(HttpCode.OK).json(updatedBook);
    } catch (error) {
      console.error(error);
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur" });
    }
  },
  deletebook: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.livres.delete({
        where: {
          livreID: id
        }
      })
      res.status(HttpCode.NO_CONTENT).json({ msg: "Livre supprimé avec succès" });
    } catch (error) {
      console.error(error);
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur" });
    }
  }
}
export default BookControllers