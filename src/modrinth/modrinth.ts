import { API_HOST } from "./constants";
import { ProjectResponse, SearchResponse } from "./modrinth.d";

export class Modrinth {
	private readonly baseUrl = `https://${API_HOST}/v2`;

	public async getProject(slugOrId: string): Promise<ProjectResponse> {
		const response = await fetch(this.getProjectUrl(slugOrId));

		if (!response.ok)
			throw new Error(`Failed to fetch modrinth project: ${slugOrId}`);

		return await response.json();
	}

	public async search(query: string, facets: string): Promise<SearchResponse[]> {
		const response = await fetch(this.getSearchUrl(query, facets));

		if (!response.ok)
			throw new Error(`Failed to fetch modrinth search: ${query}`);

		return await response.json();
	}

	private getProjectUrl(slugOrId: string) {
		return `${this.baseUrl}/project/${encodeURIComponent(slugOrId)}`;
	}

	private getSearchUrl(query: string, facets: string) {
		const facetsQuery = facets.length > 0 ? `&facets=${encodeURIComponent(facets)}` : '';

		return `${this.baseUrl}/search?query=${encodeURIComponent(query)}${facetsQuery}`;
	}
}
