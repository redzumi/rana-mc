import { Facets, modrinth, ModrinthUtils, ProjectHit } from '../modrinth';
import { EnrichedModData, ModData, WorkspaceUtils } from '../workspace';

export class ModrinthFetcher {
	public async enrichWithModrinthData(
		mods: ModData[],
	): Promise<EnrichedModData[]> {
		return Promise.all(
			mods.map(async (mod) => {
				if (!mod.metadata || !mod.metadata.fabric) {
					return {
						...mod,
						modrinthProject: null,
						gameVersions: [],
					};
				}

				const fabricMeta = mod.metadata.fabric;
				const id = fabricMeta?.id;

				const modProject = await modrinth.getProject(id);

				if (modProject) {
					return {
						...mod,
						modrinthProject: modProject,
						gameVersions: modProject.game_versions,
					};
				}

				const name = fabricMeta?.name;
				const author = WorkspaceUtils.getAuthor(fabricMeta.authors);

				const facets = ModrinthUtils.getSearchFacets([[Facets.equals('author', author)]]);

				const modSearchHits = await modrinth.search(name, facets);

				if (modSearchHits === null || modSearchHits.hits.length === 0) {
					return {
						...mod,
						modrinthProject: null,
						gameVersions: [],
					};
				}

				const modHit = modSearchHits[0] as ProjectHit;

				return {
					...mod,
					modrinthProject: modHit,
					gameVersions: modHit ? modHit.versions : [],
				};
			}),
		);
	}
}
