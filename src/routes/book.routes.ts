import { Router } from 'express';

import BookControllers from '../controllers/books.controller';

const bookroute = Router()


bookroute.get('/',BookControllers.getbooks)
bookroute.post('/',BookControllers.createbooks)
bookroute.put('/:id',BookControllers.updateBooks)
bookroute.delete('/:id',BookControllers.deletebook)

export default bookroute