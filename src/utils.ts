import * as fs from 'fs';
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
