

import { saveJsonToFile } from './helpers';
import { Facets, Modrinth, ModrinthUtils } from './modrinth';
import { Paths } from './paths';
import { MIN_DOWNLOADS } from './workspace/constants';
import { ModScanner } from './workspace/scanner';
import { ModData } from './workspace/workspace.d';

class ModrinthFetcher {
	private modrinth = new Modrinth();

	public async enrichWithModrinthData(mods: ModData[]) {
		return Promise.all(mods.map(async (mod) => {
			if (!mod.metadata || !mod.metadata.fabric) {
				return { ...mod, modrinthProject: null, latestVersion: null };
			}

			const id = mod.metadata.fabric?.id;
			const modProject = await this.modrinth.getProject(id);

			if (modProject) {
				return { ...mod, modrinthProject: modProject, latestVersion: null };
			}

			const name = mod.metadata.fabric?.name;
			const facets = ModrinthUtils.getSearchFacets([
				[Facets.equals('author', 'geometrically')],
				[Facets.gte('downloads', MIN_DOWNLOADS)]
			]);

			const modSearchHits = await this.modrinth.search(name, facets);

			if (modSearchHits.length === 0) {
				return { ...mod, modrinthProject: null, latestVersion: null };
			}

			const modHit = modSearchHits[0];

			return { ...mod, modrinthProject: modHit, latestVersion: null };
		}));
	}
}

class ModProcessor {
	public static async run() {
		const modsPath = Paths.getModsPath();
		const mods = await ModScanner.getMods(modsPath);

		const modrinthFetcher = new ModrinthFetcher();
		const enrichedMods = await modrinthFetcher.enrichWithModrinthData(mods);

		console.log(enrichedMods);
		saveJsonToFile('fabricModsData.json', enrichedMods);

		const successful = enrichedMods.filter(m => m.modrinthProject !== null);
		console.log(`Done ${successful.length} mods of ${mods.length}`);
	}
}

ModProcessor.run();
