
import * as path from 'path';

import { readFilesInMinecraftFolder, readManifestFromJar } from './utils';

// TODO: Replace by choosing from ui?
const multiMCVersion = '1.20.4';
const multiMCPath = path.join('C:', 'Games', 'MultiMC', 'instances', multiMCVersion, '.minecraft');
const minecraftPath = path.join(process.env.APPDATA || '', '.minecraft');
const usingMultiMC = true;
const modsPath = path.join(usingMultiMC ? multiMCPath : minecraftPath, 'mods');

const main = async () => {
  const files = await readFilesInMinecraftFolder(modsPath);
  console.log(files);

	const manifest = await readManifestFromJar(files[0].path);
	console.log(manifest);
};

main();