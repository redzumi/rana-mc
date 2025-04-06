import { Workspace } from '.';
import { ModData } from './workspace.d';

export class ModScanner {
	public static async getMods(modsPath: string): Promise<ModData[]> {
		const files = await Workspace.readModsFiles(modsPath);

		return Promise.all(files.map(async (file) => ({
			...file,
			metadata: (await Workspace.readModMetadata(file.path))
		})));
	}
}