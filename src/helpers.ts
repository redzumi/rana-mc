import * as fs from 'fs';

export const saveJsonToFile = async (filePath: string, data: object): Promise<void> => {
	try {
		const jsonData = JSON.stringify(data, null, 2);
		await fs.promises.writeFile(filePath, jsonData, 'utf-8');
	} catch (error) {
		console.error(error);
	}
};