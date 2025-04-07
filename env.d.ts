declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CF_API_KEY_B64: string;
		}
	}
}

export {};
