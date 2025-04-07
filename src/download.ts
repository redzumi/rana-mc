import axios from "axios";
import fs from "fs";
import path from "path";

import { MODS_DIR } from "./constants";

export const downloadFileToMods = async (url: string, filename: string): Promise<void> => {
	const modsDir = path.resolve(__dirname, '..', MODS_DIR);

	if (!fs.existsSync(modsDir)) {
		fs.mkdirSync(modsDir);
	}

	const filePath = path.join(modsDir, filename);
	const writer = fs.createWriteStream(filePath);

	try {
		const response = await axios({
			method: "GET",
			url,
			responseType: "stream",
			maxRedirects: 5,
		});

		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on("finish", () => {
				console.log(`Downloaded: ${filename}`);
				resolve();
			});
			writer.on("error", reject);
		});
	} catch (error) {
		console.error(`Error while loading ${url}:`, error.message);
	}
}