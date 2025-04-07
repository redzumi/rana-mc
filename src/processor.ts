import { TARGET_VERSION } from './constants';
import { curseForge } from './curseforge';
import { downloadFileToMods } from './download';
import { CurseforgeFetcher } from './fetchers';
import { Paths } from './paths';
import { EnrichedModData, ModData, ModScanner } from './workspace';

const DEBUG = false;

export class ModProcessor {
	public static async getMods() {
		const modsPath = Paths.getModsPath();
		const mods = await ModScanner.getMods(modsPath);

		const missedMods: EnrichedModData[] = [];

		// const modrinthFetcher = new ModrinthFetcher();
		// const modrinthEnrichedMods = await modrinthFetcher.enrichWithModrinthData(mods);

		// const modrinthMods = modrinthEnrichedMods.filter((m) => {
		// 	const hasProject = Boolean(m.modrinthProject);

		// 	if (!hasProject) {
		// 		const fabricMeta = m.metadata.fabric;

		// 		if (DEBUG) {
		// 			console.log(
		// 				`Mod ${fabricMeta?.name} is not found in modrinth: ${JSON.stringify({
		// 					author: fabricMeta?.authors,
		// 					id: fabricMeta?.id,
		// 				})}`,
		// 			);
		// 		}
		// 	}

		// 	return hasProject;
		// });

		// console.log(`Fetched modrinthMods: ${modrinthMods.length} mods of ${mods.length}`);
		const curseforgeFetcher = new CurseforgeFetcher();

		// const modsToEnrich = modrinthEnrichedMods.filter((m) => !Boolean(m.modrinthProject));
		// console.log(`Mods to enrich: ${modsToEnrich.length} mods of ${mods.length}`);

		const curseforgeEnrichedMods = await curseforgeFetcher.enrichWithCurseforgeData(
			mods as ModData[],
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

			const isMissed =
				!m.curseforgeProject || !m.gameVersions.includes(TARGET_VERSION);

			if (isMissed) missedMods.push(m);

			return hasProject;
		});

		const enrichedMods = [...curseforgeMods];

		console.log(
			`Fetched curseforgeMods: ${enrichedMods.length} mods of ${mods.length}`,
		);

		return {
			enrichedMods,
			missedMods,
		};
	}

	public static async saveMods(mods: EnrichedModData[]) {
		const downloadUrls = await Promise.all(mods.map(async (m) => {
			const targetFile = m.curseforgeProject?.latestFilesIndexes?.find(
				(f) => f.gameVersion === TARGET_VERSION,
			);

			if (!targetFile) return;

			const modId = m.curseforgeProject!.id;
			const fileId = targetFile!.fileId;

			const url = await curseForge.getDownloadUrl(modId, fileId);

			if (!url) return;

			return {
				data: url.data,
				fileName: targetFile!.filename,
			}
		}));

		return await Promise.all(
			downloadUrls
				.filter(url => !!url)
				.map((url) => downloadFileToMods(url.data, url?.fileName)),
		);
	}
}
