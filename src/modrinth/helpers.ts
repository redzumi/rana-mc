export const getEnv = () => process.env.NODE_ENV || 'development';
export const isDev = () => getEnv() === 'development';
