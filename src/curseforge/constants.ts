export enum GameIds {
	Minecraft = 432,
}

export const API_HOST = 'https://api.curseforge.com';

export const GAME_ID = GameIds.Minecraft;

export enum ClassIds {
	MC_Mods = 6,
}

export enum SortOrder {
	Ascending = 'asc',
	Descending = 'desc',
}

export enum ModLoaderType {
	Any = 0,
	Forge = 1,
	Cauldron = 2,
	LiteLoader = 3,
	Fabric = 4,
	Quilt = 5,
	NeoForge = 6,
}

export enum ModsSearchSortField {
	Featured = 1,
	Popularity = 2,
	LastUpdated = 3,
	Name = 4,
	Author = 5,
	TotalDownloads = 6,
	Category = 7,
	GameVersion = 8,
	EarlyAccess = 9,
	FeaturedReleased = 10,
	ReleasedDate = 11,
	Rating = 12,
}
