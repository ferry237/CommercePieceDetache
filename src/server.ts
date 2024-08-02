import compression from 'compression';
import cookieParser from 'cookie-parser';
// src/server.ts
// Configurations de Middlewares
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import {
  ONE_HUNDRED,
  SIXTY,
} from './core/constants';
import bookroute from './routes/book.routes';
import routeEmprunt from './routes/emprunt.routes';
import useroute from './routes/user.routes';
import { setupSwagger } from './swagger';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
	rateLimit({
		max: ONE_HUNDRED,
		windowMs: SIXTY,
		message: 'Trop de Requete à partir de cette adresse IP '
	})
);
app.use(cookieParser());
app.use("/users", useroute);
app.use("/books", bookroute);
app.use("/loans", routeEmprunt);
app.use(morgan('combined'));

setupSwagger(app);
export default app;
