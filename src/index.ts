

import { MODS_FILENAME } from './constants';
import { saveJsonToFile } from './helpers';
import { Facets, Modrinth, ModrinthUtils } from './modrinth';
import { Paths } from './paths';
import { WorkspaceUtils } from './workspace';
import { ModScanner } from './workspace/scanner';
import { ModData } from './workspace/workspace.d';

class ModrinthFetcher {
	private modrinth = new Modrinth();

	public async enrichWithModrinthData(mods: ModData[]) {
		return Promise.all(mods.map(async (mod) => {
			if (!mod.metadata || !mod.metadata.fabric) {
				return { ...mod, modrinthProject: null, latestVersion: null };
			}

			const fabricMeta = mod.metadata.fabric;

			const id = fabricMeta?.id;
			const modProject = await this.modrinth.getProject(id);

			if (modProject) {
				return {
					...mod,
					modrinthProject: modProject,
					latestVersion: this.getLatestVersion(modProject.versions)
				};
			}

			const name = fabricMeta?.name;
			const author = WorkspaceUtils.getAuthor(fabricMeta.authors);

			const facets = ModrinthUtils.getSearchFacets([
				[Facets.equals('author', author)],
				// FYI: Maybe later
				// [Facets.gte('downloads', MIN_DOWNLOADS)]
			]);

			const modSearchHits = await this.modrinth.search(name, facets);

			if (modSearchHits === null || modSearchHits.hits.length === 0) {
				return {
					...mod,
					modrinthProject: null,
					latestVersion: null
				};
			}

			const modHit = modSearchHits[0];

			return {
				...mod,
				modrinthProject: modHit,
				latestVersion: this.getLatestVersion(modHit.versions)
			};
		}));
	}

	private getLatestVersion(versions: string[]) {
		return versions[versions.length - 1];
	}
}

class ModProcessor {
	public static async run() {
		const modsPath = Paths.getModsPath();
		const mods = await ModScanner.getMods(modsPath);

		const modrinthFetcher = new ModrinthFetcher();
		const enrichedMods = await modrinthFetcher.enrichWithModrinthData(mods);

		saveJsonToFile(MODS_FILENAME, enrichedMods);

		const successful = enrichedMods.filter(m => {
			const hasProject = m.modrinthProject !== null;

			if (!hasProject) {
				const fabricMeta = m.metadata.fabric;
				console.log(`Mod ${fabricMeta?.name} is not found in modrinth: ${JSON.stringify({
					author: fabricMeta?.authors,
					id: fabricMeta?.id,
				})}`);
			}

			return hasProject;
		});
		console.log(`Done ${successful.length} mods of ${mods.length}`);
	}
}

ModProcessor.run();
