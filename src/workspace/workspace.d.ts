interface FabricModMetadata {
	schemaVersion: number;
	id: string;
	version: string;
	name: string;
	description: string;
	authors:
	| string[]
	| {
		name: string;
		contact: {
			homepage: string;
		};
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface QuitModMetadata { }

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