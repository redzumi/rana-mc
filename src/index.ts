
import * as path from 'path';

import { saveJsonToFile } from './helpers';
import { getProjectUrl, ModProjectResponse } from './modrinth';
import { readFilesInMinecraftFolder, readManifestFromJar } from './utils';

// TODO: Replace by choosing from ui?
const multiMCVersion = '1.20.4';
const multiMCPath = path.join('C:', 'Games', 'MultiMC', 'instances', multiMCVersion, '.minecraft');
const minecraftPath = path.join(process.env.APPDATA || '', '.minecraft');
const usingMultiMC = true;
const modsPath = path.join(usingMultiMC ? multiMCPath : minecraftPath, 'mods');

const main = async () => {
	const files = await readFilesInMinecraftFolder(modsPath);

	// TODO: Maybe and other, not only fabric mods
	const fabricMods = await Promise.all(files.map(async (file) => ({
		...file,
		meta: (await readManifestFromJar(file.path)).fabricMod
	})));

	const fabricModsData = await Promise.all(fabricMods.map(async (fabricMod) => {
		if (fabricMod.meta) console.log(fabricMod.meta.name);

		if (!fabricMod.meta) return {
			...fabricMod,
			modrinthProject: null,
			latestVersion: null
		};

		const id = fabricMod.meta.id;
		const projectUrl = getProjectUrl(id);

		const modrinthProjectData = await fetch(projectUrl);

		if (!modrinthProjectData.ok) {
			console.error('No modrinth project data:', id);
			console.error(projectUrl);

			return {
				...fabricMod,
				modrinthProject: null,
				latestVersion: null
			};
		}

		const modrinthProject = (await modrinthProjectData.json()) as ModProjectResponse;

		if (!modrinthProjectData) {
			console.error('No modrinth project data:', id);
			console.error(projectUrl);

			return {
				...fabricMod,
				modrinthProject: null,
				latestVersion: null
			};
		}

		const latestVersion = modrinthProject.versions[modrinthProject.versions.length - 1];

		return {
			...fabricMod,
			modrinthProject,
			latestVersion
		}
	}));

	console.log(fabricModsData);
	saveJsonToFile('fabricModsData.json', fabricModsData);

	const modsWithData = fabricModsData.filter((fabricMod) => fabricMod.modrinthProject !== null);
	console.log(`Done ${modsWithData.length} mods of ${fabricMods.length}`);
};

main();