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
import pieceRoute from './routes/Pieces.Routes';
import RouteUser from './routes/User.Routes';
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
app.use(RouteUser),
app.use(pieceRoute),
app.use(morgan('combined'));

setupSwagger(app);
export default app;
