export interface SearchResponse {
	data: CurseforgeProject[];
	pagination: Pagination;
}

export interface DownloadUrlResponse {
	data: string;
}

export interface CurseforgeProject {
	screenshots: Logo[];
	id: number;
	gameId: number;
	name: string;
	slug: string;
	links: Links;
	summary: string;
	status: number;
	downloadCount: number;
	isFeatured: boolean;
	primaryCategoryId: number;
	categories: Category[];
	classId: number;
	authors: Author[];
	logo: Logo;
	mainFileId: number;
	latestFiles: LatestFile[];
	latestFilesIndexes: LatestFilesIndex[];
	latestEarlyAccessFilesIndexes: unknown[];
	dateCreated: Date;
	dateModified: Date;
	dateReleased: Date;
	allowModDistribution: boolean;
	gamePopularityRank: number;
	isAvailable: boolean;
	thumbsUpCount: number;
	socialLinks?: SocialLink[];
	featuredProjectTag: number;
	serverAffiliation?: ServerAffiliation;
}

export interface Author {
	id: number;
	name: string;
	url: string;
	avatarUrl: null | string;
}

export interface Category {
	id: number;
	gameId: number;
	name: string;
	slug: string;
	url: string;
	iconUrl: string;
	dateModified: Date;
	isClass: boolean;
	classId: number;
	parentCategoryId: number;
}

export interface LatestFile {
	id: number;
	gameId: number;
	modId: number;
	isAvailable: boolean;
	displayName: string;
	fileName: string;
	releaseType: number;
	fileStatus: number;
	hashes: Hash[];
	fileDate: Date;
	fileLength: number;
	downloadCount: number;
	fileSizeOnDisk?: number;
	downloadUrl: null | string;
	gameVersions: string[];
	sortableGameVersions: SortableGameVersion[];
	dependencies: Dependency[];
	alternateFileId: number;
	isServerPack: boolean;
	fileFingerprint: number;
	modules: Module[];
}

export interface Dependency {
	modId: number;
	relationType: number;
}

export interface Hash {
	value: string;
	algo: number;
}

export interface Module {
	name: string;
	fingerprint: number;
}

export interface SortableGameVersion {
	gameVersionName: string;
	gameVersionPadded: string;
	gameVersion: string;
	gameVersionReleaseDate: Date;
	gameVersionTypeId: number;
}

export interface LatestFilesIndex {
	gameVersion: string;
	fileId: number;
	filename: string;
	releaseType: number;
	gameVersionTypeId: number;
	modLoader?: number;
}

export interface Links {
	websiteUrl: string;
	wikiUrl: null | string;
	issuesUrl: null | string;
	sourceUrl: null | string;
}

export interface Logo {
	id: number;
	modId: number;
	title: string;
	description: string;
	thumbnailUrl: string;
	url: string;
}

export interface ServerAffiliation {
	isEnabled: boolean;
	isDefaultBanner: boolean;
	hasDiscount: boolean;
	affiliationService: number;
	defaultBannerCustomTitle: string;
	affiliationLink: string;
}

export interface SocialLink {
	type: number;
	url: string;
}

export interface Pagination {
	index: number;
	pageSize: number;
	resultCount: number;
	totalCount: number;
}
