// import { Response, NextFunction } from 'express';
// import { AuthenticatedRequest } from './auth.middleware'; // Assuming you have this

// export const authorizeRole = (allowedRoles: string[]) => {
//   // [cite: 37]
//   return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     if (!req.user || !req.user.role) {
//       // [cite: 57]
//       return res.status(403).json({ message: 'Forbidden: User role not found.' });
//     }
//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: `Forbidden: Role ${req.user.role} is not authorized.` }); // [cite: 101]
//     }
//     next();
//   };
// };
