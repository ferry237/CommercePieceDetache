import { Router } from 'express';

import PieceController from '../controllers/Pieces.Controllers';

const pieceRoute = Router()


pieceRoute.get('/pieces', PieceController.getPieces)
pieceRoute.get('/pieces/:id', PieceController.getOnePiece)
pieceRoute.post('/pieces', PieceController.createPiece)
pieceRoute.put('/pieces/:id', PieceController.UpdateUser)
pieceRoute.delete('/pieces/:id', PieceController.deleteUser)


export default pieceRoute