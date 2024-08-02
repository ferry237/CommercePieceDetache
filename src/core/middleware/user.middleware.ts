import {
  NextFunction,
  Request,
  Response,
} from 'express';

import mytokens from '../config/tokens';
import { HttpCode } from '../constants';

export interface CustomRequest extends Request {
  user?: any;
}

const authMiddleware = {
  decodeRefreshToken: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.cookies.exbibliofeco;
    if (!token) {
      console.log("No refresh token provided");
      return res.status(HttpCode.BAD_REQUEST).json({
        msg: "aucun token de rafrechissement"
      });
    }

    try {
      const decodedUser = await mytokens.verifyRefreshToken(token);
      if (!decodedUser) {
        return res.status(HttpCode.FORBIDDEN).json({
          message: "Forbidden: Invalid refresh token"
        });
      }
      req.user = decodedUser;
      next();
      return; 
    } catch (error) {
      console.error("Error decoding refresh token:", error);
      return res.status(HttpCode.FORBIDDEN).json({
        msg: "erreur de token de rafraichissement!"
      });
    }
  },

  decodeAccessToken: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const accesstoken = req.headers.authorization;
    const refresh_token = req.cookies.exbibliofeco;
    if (!accesstoken && !refresh_token) {
      console.log("No access token provided");
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "Unauthorized: No access token provided"
      });
    }

    try {
      const decodedUser = await mytokens.verifyAccessToken(accesstoken);
      if (decodedUser) {
        req.user = decodedUser;
        next();
      }
      return res.status(HttpCode.FORBIDDEN).json({
        message: "jeton d'access invalide"
      });
      
      return; // Ensure the function returns after calling next()
    } catch (error) {
      console.error("Error decoding access token:", error);
      return res.status(HttpCode.FORBIDDEN).json({
        message: "Forbidden: Error decoding access token"
      });
    }
  },

};

export default authMiddleware;
