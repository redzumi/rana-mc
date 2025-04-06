import * as fs from 'fs';
import * as JSZip from 'jszip';
import * as path from 'path';

export const readFilesInMinecraftFolder = async (folderPath: string): Promise<{ path: string, filename: string }[]> => {
	try {
		const files = await fs.promises.readdir(folderPath);
		const getFileStats = async (file: string) => {
			const filePath = path.join(folderPath, file);
			const stats = await fs.promises.stat(filePath);

			return stats.isFile() ? { path: filePath, filename: file } : null;
		};
		const fileStats = await Promise.all(files.map(getFileStats));

		return fileStats.filter((file) => file !== null) as { path: string, filename: string }[];
	} catch (err) {
		throw new Error(err.message);
	}
};

const manifestFilename = 'META-INF/MANIFEST.MF';
const fabricModFilename = 'fabric.mod.json';
const quitModFilename = 'quit.mod.json';

const parseJson = (content: string | null): object | null => {
	try {
		return content ? JSON.parse(content) : null;
	} catch (e) {
		console.error(e);

		return null;
	}
};

interface FabricModInfo {
	schemaVersion: number;
	id: string;
	version: string;
	name: string;
	description: string;
	authors: string[] | {
		name: string,
		contact: { homepage: string }
	}[];
	contact: {
		homepage: string;
		sources: string;
	};
	license: string;
	icon: string;
	environment: string;
	entrypoints: {
		main: string[];
	};
	mixins: string[];
	depends: {
		fabric: string;
		minecraft: string;
		architectury: string;
	};
	accessWidener: string;
}

export const readManifestFromJar = (jarFilePath: string): Promise<{ manifest: string | null, fabricMod: FabricModInfo | null, quitMod: object | null }> => {
	return fs.promises.readFile(jarFilePath)
		.then(data => JSZip.loadAsync(data))
		.then(zip => Promise.all([
			zip.file(manifestFilename)?.async('string') || null,
			zip.file(fabricModFilename)?.async('string').then(parseJson) || null,
			zip.file(quitModFilename)?.async('string').then(parseJson) || null,
		]))
		.then(([manifest, fabricMod, quitMod]) => ({ manifest, fabricMod: fabricMod as FabricModInfo, quitMod }))
		.catch(() => ({ manifest: null, fabricMod: null, quitMod: null }));
};