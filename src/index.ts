import { config } from 'dotenv';

import { LATEST_VERSIONS, MODS_URLS_FILENAME } from './constants';
import { Curseforge, LatestFile } from './curseforge';
import { saveToFile } from './helpers';
import { Facets, Modrinth, ModrinthUtils } from './modrinth';
import { ProjectHit } from './modrinth/modrinth.d';
import { Paths } from './paths';
import { WorkspaceUtils } from './workspace';
import { ModScanner } from './workspace/scanner';
import { EnrichedModData, ModData } from './workspace/workspace.d';

config();

const DEBUG = false;

class ModrinthFetcher {
	private modrinth = new Modrinth();

	public async enrichWithModrinthData(mods: ModData[]):
		Promise<Omit<EnrichedModData, 'curseforgeProject'>[]> {
		return Promise.all(mods.map(async (mod) => {
			if (!mod.metadata || !mod.metadata.fabric) {
				return {
					...mod,
					modrinthProject: null,
					gameVersions: []
				};
			}

			const fabricMeta = mod.metadata.fabric;
			const id = fabricMeta?.id;

			const modProject = await this.modrinth.getProject(id);

			if (modProject) {
				return {
					...mod,
					modrinthProject: modProject,
					gameVersions: modProject.game_versions
				};
			}

			const name = fabricMeta?.name;
			const author = WorkspaceUtils.getAuthor(fabricMeta.authors);

			const facets = ModrinthUtils.getSearchFacets([
				[Facets.equals('author', author)],
			]);

			const modSearchHits = await this.modrinth.search(name, facets);

			if (modSearchHits === null || modSearchHits.hits.length === 0) {
				return {
					...mod,
					modrinthProject: null,
					gameVersions: []
				};
			}

			const modHit = modSearchHits[0] as ProjectHit;

			return {
				...mod,
				modrinthProject: modHit,
				gameVersions: modHit ? modHit.versions : []
			};
		}));
	}
}

class CurseforgeFetcher {
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

class ModProcessor {
	public static async run() {
		const modsPath = Paths.getModsPath();
		const mods = await ModScanner.getMods(modsPath);

		const modrinthFetcher = new ModrinthFetcher();
		const modrinthEnrichedMods = await modrinthFetcher.enrichWithModrinthData(mods);

		const modrinthMods = modrinthEnrichedMods.filter(m => {
			const hasProject = Boolean(m.modrinthProject);

			if (!hasProject) {
				const fabricMeta = m.metadata.fabric;

				if (DEBUG) {
					console.log(
						`Mod ${fabricMeta?.name} is not found in modrinth: ${JSON.stringify({
							author: fabricMeta?.authors,
							id: fabricMeta?.id,
						})}`);
				}
			}

			return hasProject;
		});

		console.log(`Fetched modrinthMods: ${modrinthMods.length} mods of ${mods.length}`);

		const curseforgeApiKey =
			Buffer.from(process.env.CF_API_KEY_B64 || '', 'base64')
				.toString('utf-8');

		const curseforgeFetcher = new CurseforgeFetcher(curseforgeApiKey);

		const modsToEnrich = modrinthEnrichedMods.filter((m) => !Boolean(m.modrinthProject));

		console.log(`Mods to enrich: ${modsToEnrich.length} mods of ${mods.length}`);

		const curseforgeEnrichedMods =
			await curseforgeFetcher.enrichWithCurseforgeData(modsToEnrich as ModData[]);

		const curseforgeMods = curseforgeEnrichedMods.filter(m => {
			const hasProject = Boolean(m.curseforgeProject);

			if (!hasProject) {
				const fabricMeta = m.metadata.fabric;

				if (DEBUG) {
					console.log(
						`Mod ${fabricMeta?.name} is not found in curseforge: ${JSON.stringify({
							author: fabricMeta?.authors,
							id: fabricMeta?.id,
						})}`);
				}
			}

			return hasProject;
		});

		console.log(`Fetched curseforgeMods: ${curseforgeMods.length} mods of ${mods.length}`);

		const modsWithData = [...modrinthMods, ...curseforgeMods] as EnrichedModData[];

		const gameVersionsCount =
			modsWithData.reduce((acc: Record<string, number>, mod: EnrichedModData) => {
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

		const modrinthUrls = modrinthMods
			.map(m => m.modrinthProject)
			.filter(Boolean)
			.map((m) => ModrinthUtils.getModUrl(m!.slug));

		const curseforgeUrls = curseforgeMods
			.map(m => m.curseforgeProject)
			.filter(Boolean)
			.map((m) => m?.links.websiteUrl);

		const urls = [...modrinthUrls, ...curseforgeUrls];

		saveToFile(MODS_URLS_FILENAME, urls.join('\n'));
	}
}

ModProcessor.run();
