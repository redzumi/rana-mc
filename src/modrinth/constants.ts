import { isDev } from "./helpers";

export const API_HOST = isDev() ? 'staging-api.modrinth.com' : 'api.modrinth.com';
