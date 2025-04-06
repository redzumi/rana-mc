import * as path from 'path';

export class Paths {
	private static readonly multiMCVersion = '1.20.4';
	private static readonly multiMCPath = path.join('C:', 'Games', 'MultiMC', 'instances', this.multiMCVersion, '.minecraft');
	private static readonly minecraftPath = path.join(process.env.APPDATA || '', '.minecraft');
	private static readonly usingMultiMC = true;

	public static getModsPath(): string {
		return path.join(this.usingMultiMC ? this.multiMCPath : this.minecraftPath, 'mods');
	}
}