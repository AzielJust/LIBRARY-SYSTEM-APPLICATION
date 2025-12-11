export const config = {
    jwtSecret: process.env.JWT_SECRET || 'manzanas',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d'
  };