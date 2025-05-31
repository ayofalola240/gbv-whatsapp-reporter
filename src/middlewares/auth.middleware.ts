// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { User } from '../../models/user.model'; // Assuming User model

// const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// export interface AuthenticatedRequest extends Request {
//   user?: any; // Define a more specific type based on your User model
// }

// export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
//       // Optionally, fetch user from DB to ensure they still exist/are active
//       const user = await User.findById(decoded.id).select('-passwordHash'); // [cite: 57]
//       if (!user) {
//         return res.sendStatus(403); // Forbidden if user not found
//       }
//       req.user = user; // Add user to request object
//       next();
//     } catch (err) {
//       console.error('JWT Auth Error:', err);
//       return res.sendStatus(403); // Forbidden (invalid token)
//     }
//   } else {
//     res.sendStatus(401); // Unauthorized
//   }
// };
