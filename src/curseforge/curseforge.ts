import { EnrichedModData } from '../workspace';
import { API_HOST, ModLoaderType } from './constants';
import { DownloadUrlResponse, SearchResponse } from './curseforge.d';

const DEBUG = false;

export class Curseforge {
	private apiKey: string;
	private apiHost: string = API_HOST;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	async search(params: string, name?: string) {
		try {
			const url = `${this.apiHost}/v1/mods/search?${params}`;
			const response = await fetch(url, {
				headers: {
					'x-api-key': this.apiKey,
					accept: 'application/json',
					'content-type': 'application/json',
				},
			});

			if (!response.ok) {
				if (DEBUG)
					console.error(`Failed to fetch curseforge search: ${name}`, response.status);

				return null;
			}

			return (await response.json()) as SearchResponse;
		} catch (err: unknown) {
			console.error(err);

			return null;
		}
	}

	async getInstallFile(
		mod: EnrichedModData,
		modLoader: ModLoaderType,
		gameVersion: string,
	) {
		const targetFile = mod.curseforgeProject?.latestFilesIndexes?.find(
			(f) => f.gameVersion === gameVersion && f.modLoader === modLoader,
		);

		if (!targetFile) return;

		return {
			modId: mod.curseforgeProject!.id,
			...targetFile
		};
	}

	async getDownloadUrl(modId: string | number, fileId: string | number) {
		const url = `${this.apiHost}/v1/mods/${modId}/files/${fileId}/download-url`;
		const response = await fetch(url, {
			headers: {
				'x-api-key': this.apiKey,
				accept: 'application/json',
				'content-type': 'application/json',
			},
		});

		if (!response.ok) {
			if (DEBUG)
				console.error(`Failed to fetch curseforge download url: ${modId}`, response.status);

			return null;
		}

		return (await response.json()) as DownloadUrlResponse;
	}
}

const curseforgeApiKey = Buffer.from(
	process.env.CF_API_KEY_B64 || '',
	'base64',
).toString('utf-8');

export const curseForge = new Curseforge(curseforgeApiKey);