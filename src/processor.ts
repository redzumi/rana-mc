import { CurseforgeFetcher, ModrinthFetcher } from './fetchers';
import { Paths } from './paths';
import { EnrichedModData, ModData, ModScanner } from './workspace';

const DEBUG = false;

export class ModProcessor {
	public static async getMods() {
		const modsPath = Paths.getModsPath();
		const mods = await ModScanner.getMods(modsPath);

		const modrinthFetcher = new ModrinthFetcher();
		const modrinthEnrichedMods = await modrinthFetcher.enrichWithModrinthData(mods);

		const modrinthMods = modrinthEnrichedMods.filter((m) => {
			const hasProject = Boolean(m.modrinthProject);

			if (!hasProject) {
				const fabricMeta = m.metadata.fabric;

				if (DEBUG) {
					console.log(
						`Mod ${fabricMeta?.name} is not found in modrinth: ${JSON.stringify({
							author: fabricMeta?.authors,
							id: fabricMeta?.id,
						})}`,
					);
				}
			}

			return hasProject;
		});

		console.log(`Fetched modrinthMods: ${modrinthMods.length} mods of ${mods.length}`);

		const curseforgeApiKey = Buffer.from(
			process.env.CF_API_KEY_B64 || '',
			'base64',
		).toString('utf-8');

		const curseforgeFetcher = new CurseforgeFetcher(curseforgeApiKey);

		const modsToEnrich = modrinthEnrichedMods.filter((m) => !Boolean(m.modrinthProject));
		console.log(`Mods to enrich: ${modsToEnrich.length} mods of ${mods.length}`);

		const curseforgeEnrichedMods = await curseforgeFetcher.enrichWithCurseforgeData(
			modsToEnrich as ModData[],
		);

		const curseforgeMods = curseforgeEnrichedMods.filter((m) => {
			const hasProject = Boolean(m.curseforgeProject);

			if (!hasProject) {
				const fabricMeta = m.metadata.fabric;

				if (DEBUG) {
					console.log(
						`Mod ${fabricMeta?.name} is not found in curseforge: ${JSON.stringify({
							author: fabricMeta?.authors,
							id: fabricMeta?.id,
						})}`,
					);
				}
			}

			return hasProject;
		});

		console.log(
			`Fetched curseforgeMods: ${curseforgeMods.length} mods of ${mods.length}`,
		);

		return [...modrinthMods, ...curseforgeMods] as EnrichedModData[];
	}
}
