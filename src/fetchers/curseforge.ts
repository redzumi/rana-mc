import { Curseforge, LatestFile } from "../curseforge";
import { EnrichedModData, ModData } from "../workspace";

export class CurseforgeFetcher {
	private curseforge: Curseforge;

	constructor(apiKey: string) {
		this.curseforge = new Curseforge(apiKey);
	}

	public async enrichWithCurseforgeData(mods: ModData[]):
		Promise<Omit<EnrichedModData, 'modrinthProject'>[]> {
		return Promise.all(mods.map(async (mod) => {
			if (!mod.metadata || !mod.metadata.fabric) {
				return {
					...mod,
					curseforgeProject: null,
					gameVersions: []
				};
			}

			const fabricMeta = mod.metadata.fabric;
			const name = fabricMeta?.name;

			const searchResponse = await this.curseforge.search(name);
			if (!searchResponse || searchResponse.data.length === 0) {
				return {
					...mod,
					curseforgeProject: null,
					gameVersions: []
				};
			}

			const modProject = searchResponse.data[0];

			return {
				...mod,
				curseforgeProject: modProject,
				gameVersions: this.getGameVersions(modProject.latestFiles)
			};
		}));
	}

	private getGameVersions(mod: LatestFile[]) {
		return mod
			.map(f => f.sortableGameVersions.map(v => v.gameVersion))
			.flat()
			.filter((v) => v.length > 0);
	}
}