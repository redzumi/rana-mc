import * as fs from 'fs';
import * as JSZip from 'jszip';
import * as path from 'path';

import { FABRIC_META_FILENAME, MANIFEST_FILENAME, QUIT_META_FILENAME } from './constants';
import { parseJson } from './helpers';
import {
	FabricModMetadata,
	ModFileInfo,
	ModMetadata,
	QuitModMetadata,
} from './workspace.d';

export class Workspace {
	static async readModsFiles(folderPath: string): Promise<ModFileInfo[]> {
		try {
			const files = await fs.promises.readdir(folderPath);

			const fileStats = await Promise.all(
				files.map(async (file) => {
					const filePath = path.join(folderPath, file);
					const stats = await fs.promises.stat(filePath);

					return stats.isFile() ? { path: filePath, filename: file } : null;
				}),
			);

			return fileStats.filter(Boolean) as ModFileInfo[];
		} catch (err: unknown) {
			throw err;
		}
	}

	static async readModMetadata(jarFilePath: string): Promise<ModMetadata> {
		try {
			const data = await fs.promises.readFile(jarFilePath);
			const zip = await JSZip.loadAsync(data);

			const [manifest, fabricMeta, quitMeta] = await Promise.all([
				zip.file(MANIFEST_FILENAME)?.async('string') || null,
				zip.file(FABRIC_META_FILENAME)?.async('string').then(parseJson) || null,
				zip.file(QUIT_META_FILENAME)?.async('string').then(parseJson) || null,
			]);

			return {
				manifest,
				fabric: fabricMeta as FabricModMetadata,
				quit: quitMeta as QuitModMetadata,
			};
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err: unknown) {
			return {
				manifest: null,
				fabric: null,
				quit: null,
			};
		}
	}
}
