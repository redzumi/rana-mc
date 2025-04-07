import { API_HOST } from './constants';
import { ProjectResponse, SearchResponse } from './modrinth.d';

const DEBUG = false;

export class Modrinth {
	private readonly baseUrl = `https://${API_HOST}/v2`;

	public async getProject(slugOrId: string): Promise<ProjectResponse | null> {
		try {
			const response = await fetch(this.getProjectUrl(slugOrId));

			if (!response.ok) {
				if (DEBUG) console.error(`Failed to fetch modrinth project: ${slugOrId}`);

				return null;
			}

			return await response.json();
		} catch (err: unknown) {
			console.error(err);

			return null;
		}
	}

	public async search(query: string, facets: string): Promise<SearchResponse | null> {
		try {
			const response = await fetch(this.getSearchUrl(query, facets));

			if (!response.ok) {
				if (DEBUG) console.error(`Failed to fetch modrinth search: ${query}`);

				return null;
			}

			return await response.json();
		} catch (err: unknown) {
			console.error(err);

			return null;
		}
	}

	private getProjectUrl(slugOrId: string) {
		return `${this.baseUrl}/project/${encodeURIComponent(slugOrId)}`;
	}

	private getSearchUrl(query: string, facets: string) {
		const facetsQuery = facets.length > 0 ? `&facets=${encodeURIComponent(facets)}` : '';

		return `${this.baseUrl}/search?query=${encodeURIComponent(query)}${facetsQuery}`;
	}
}

export const modrinth = new Modrinth();