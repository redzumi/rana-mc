import { TARGET_VERSION } from '../constants';
import {
	ClassIds,
	curseForge,
	CurseforgeSearch,
	GameIds,
	LatestFilesIndex,
	ModLoaderType,
	ModsSearchSortField,
} from '../curseforge';
import { EnrichedModData, ModData } from '../workspace';

export class CurseforgeFetcher {
	public async enrichWithCurseforgeData(
		mods: ModData[],
	): Promise<EnrichedModData[]> {
		return Promise.all(
			mods.map(async (mod) => {
				if (!mod.metadata || !mod.metadata.fabric) {
					return {
						...mod,
						curseforgeProject: null,
						gameVersions: [],
					};
				}

				const fabricMeta = mod.metadata.fabric;
				const name = fabricMeta?.name;

				const params = new CurseforgeSearch()
					.gameId(GameIds.Minecraft)
					.classId(ClassIds.MC_Mods)
					.sortField(ModsSearchSortField.RelevanceOrFeatured)
					.gameVersion(TARGET_VERSION)
					.modLoaderType(ModLoaderType.Fabric)
					.searchFilter(name)
					.get();

				const searchResponse = await curseForge.search(params, name);
				if (!searchResponse || searchResponse.data.length === 0) {
					return {
						...mod,
						curseforgeProject: null,
						gameVersions: [],
					};
				}

				const modProject = searchResponse.data[0];

				return {
					...mod,
					curseforgeProject: modProject,
					gameVersions: this.getGameVersions(modProject.latestFilesIndexes),
				};
			}),
		);
	}

	private getGameVersions(mod: LatestFilesIndex[]) {
		return mod
			.filter((m) => m.modLoader === ModLoaderType.Fabric)
			.map((m) => m.gameVersion);
	}
}
