import { CurseforgeProject } from '../curseforge/curseforge.d';
import { ProjectHit, ProjectResponse } from '../modrinth/modrinth.d';

export type Author =
	| string
	| {
			name: string;
			contact: {
				homepage: string;
			};
	  };

interface FabricModMetadata {
	schemaVersion: number;
	id: string;
	version: string;
	name: string;
	description: string;
	authors: Author[];
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface QuitModMetadata {}

export interface ModFileInfo {
	path: string;
	filename: string;
}

export interface ModMetadata {
	manifest: string | null;
	fabric: FabricModMetadata | null;
	quit: QuitModMetadata | null;
}

export interface ModData extends ModFileInfo {
	metadata: ModMetadata;
}

export interface EnrichedModData extends ModData {
	curseforgeProject: CurseforgeProject | null;
	modrinthProject: ProjectResponse | ProjectHit | null;
	gameVersions: string[];
}
