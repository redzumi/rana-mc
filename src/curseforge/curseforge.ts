import { API_HOST, ClassIds, GameIds, ModsSearchSortField, SortOrder } from './constants';
import { SearchResponse } from './curseforge.d'
import { CurseforgeSearch } from './search';

const DEBUG = true;

export class Curseforge {
	private apiKey: string;
	private apiHost: string = API_HOST;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	async search(name: string) {
		try {
			const params = new CurseforgeSearch()
				.gameId(GameIds.Minecraft)
				.classId(ClassIds.MC_Mods)
				.sortField(ModsSearchSortField.TotalDownloads)
				.sortOrder(SortOrder.Descending)
				.searchFilter(name)
				.get();

			const url = `${this.apiHost}/v1/mods/search?${params}`;
			const response = await fetch(url, {
				headers: {
					'x-api-key': this.apiKey,
					'accept': 'application/json',
					'content-type': 'application/json'
				}
			});

			if (!response.ok) {
				if (DEBUG)
					console.error(`Failed to fetch curseforge search: ${name}`, response.status);

				return null;
			}

			return await response.json() as SearchResponse;
		} catch (err: unknown) {
			console.error(err);

			return null;
		}
	}
}