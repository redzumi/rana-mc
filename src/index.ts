

import { LATEST_VERSIONS, MODS_FILENAME, MODS_URLS_FILENAME } from './constants';
import { saveJsonToFile, saveToFile } from './helpers';
import { Facets, Modrinth, ModrinthUtils } from './modrinth';
import { ProjectHit } from './modrinth/modrinth.d';
import { Paths } from './paths';
import { WorkspaceUtils } from './workspace';
import { ModScanner } from './workspace/scanner';
import { EnrichedModData, ModData } from './workspace/workspace.d';

class ModrinthFetcher {
	private modrinth = new Modrinth();

	public async enrichWithModrinthData(mods: ModData[]): Promise<EnrichedModData[]> {
		return Promise.all(mods.map(async (mod) => {
			if (!mod.metadata || !mod.metadata.fabric) {
				return { ...mod, modrinthProject: null, latestVersion: null, gameVersions: [] };
			}

			const fabricMeta = mod.metadata.fabric;

			const id = fabricMeta?.id;
			const modProject = await this.modrinth.getProject(id);

			if (modProject) {
				return {
					...mod,
					modrinthProject: modProject,
					latestVersion: this.getLatestGameVersion(modProject.game_versions),
					gameVersions: modProject.game_versions
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
					latestVersion: null,
					gameVersions: []
				};
			}

			const modHit = modSearchHits[0] as ProjectHit;

			return {
				...mod,
				modrinthProject: modHit,
				latestVersion: modHit ? this.getLatestGameVersion(modHit.versions) : null,
				gameVersions: modHit ? modHit.versions : []
			};
		}));
	}

	private getLatestGameVersion(versions: string[]) {
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

		const modrinthMods = enrichedMods.filter(m => {
			const hasProject = Boolean(m.modrinthProject);

			if (!hasProject) {
				const fabricMeta = m.metadata.fabric;

				console.log(`Mod ${fabricMeta?.name} is not found in modrinth: ${JSON.stringify({
					author: fabricMeta?.authors,
					id: fabricMeta?.id,
				})}`);
			}

			return hasProject;
		});

		console.log(`Fetched ${modrinthMods.length} mods of ${mods.length}`);

		const gameVersionsCount = modrinthMods.reduce((acc: Record<string, number>, mod: EnrichedModData) => {
			mod.gameVersions.forEach(version => {
				acc[version] = (acc[version] || 0) + 1;
			});

			return acc;
		}, {});

		const latesVersionsCount = LATEST_VERSIONS.map(version => ({
			version,
			count: gameVersionsCount[version] || 0
		}));

		console.log(`Latest game versions: ${JSON.stringify(latesVersionsCount)}`);

		const urls = modrinthMods.map(m => m.modrinthProject).filter(Boolean).map((m) => ModrinthUtils.getModUrl(m!.slug));
		saveToFile(MODS_URLS_FILENAME, urls.join('\n'));
	}
}

ModProcessor.run();
