import { config } from 'dotenv';

import {
	LATEST_VERSIONS,
	MODS_FILENAME,
	MODS_URLS_FILENAME,
	TARGET_VERSION
} from './constants';
import { saveToFile } from './helpers';
import { ModrinthUtils } from './modrinth';
import { ModProcessor } from './processor';
import { EnrichedModData } from './workspace';

config();

class RanaMC {
	public async run(): Promise<void> {
		const { enrichedMods: mods, missedMods } = await ModProcessor.getMods();
		saveToFile(MODS_FILENAME, JSON.stringify(mods));

		const gameVersionsCount = mods.reduce(
			(acc: Record<string, number>, mod: EnrichedModData) => {
				mod.gameVersions.forEach((version) => {
					acc[version] = (acc[version] || 0) + 1;
				});

				return acc;
			},
			{},
		);

		const latesVersionsCount = LATEST_VERSIONS.map((version) => ({
			version,
			count: gameVersionsCount[version] || 0,
		}));

		console.log(`Latest game versions: ${JSON.stringify(latesVersionsCount)}`);

		const modrinthUrls = mods
			.map((m) => m.modrinthProject)
			.filter(Boolean)
			.map((m) => ModrinthUtils.getModUrl(m!.slug));

		const curseforgeUrls = mods
			.map((m) => m.curseforgeProject)
			.filter(Boolean)
			.map((m) => m?.links.websiteUrl);

		const urls = [...modrinthUrls, ...curseforgeUrls];

		saveToFile(MODS_URLS_FILENAME, urls.join('\n'));

		const targetMods = mods.filter((m) => m.gameVersions.includes(TARGET_VERSION));

		console.log(`Target mods: ${targetMods.length}`);
		saveToFile('target-mods.json', JSON.stringify(targetMods));

		console.log(`Missed mods: ${missedMods.length}`)
		saveToFile('missed-mods.txt',
			missedMods.map((m) => m.metadata.fabric?.name).join('\n')
		);

		await ModProcessor.saveMods(targetMods);

		console.log('Done');
	}
}

new RanaMC().run();
