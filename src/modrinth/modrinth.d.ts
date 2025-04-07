export interface ProjectResponse {
	client_side: 'required' | 'optional' | 'unsupported';
	server_side: 'required' | 'optional' | 'unsupported';
	game_versions: string[];
	id: string;
	slug: string;
	project_type: 'mod' | 'resource_pack' | 'data_pack';
	team: string;
	organization: string | null;
	title: string;
	description: string;
	body: string;
	body_url: string | null;
	published: string;
	updated: string;
	approved: string;
	queued: string;
	status: 'approved' | 'pending' | 'rejected';
	requested_status: 'approved' | 'pending' | 'rejected';
	moderator_message: string | null;
	license: License;
	downloads: number;
	followers: number;
	categories: string[];
	additional_categories: string[];
	loaders: ('fabric' | 'forge' | 'neoforge')[];
	versions: string[];
	icon_url: string;
	issues_url: string | null;
	source_url: string | null;
	wiki_url: string | null;
	discord_url: string | null;
	donation_urls: string[];
	gallery: string[];
	color: number;
	thread_id: string;
	monetization_status: 'monetized' | 'not_monetized';
}

interface ProjectHit {
	project_id: string;
	project_type: string;
	slug: string;
	author: string;
	title: string;
	description: string;
	categories: string[];
	display_categories: string[];
	versions: string[];
	downloads: number;
	follows: number;
	icon_url: string;
	date_created: string;
	date_modified: string;
	latest_version: string;
	license: string;
	client_side: string;
	server_side: string;
	gallery: string[];
	featured_gallery: string | null;
	color: number;
}

export interface SearchResponse {
	hits: ProjectHit[];
	offset: number;
	limit: number;
	total_hits: number;
}

interface License {
	id: string;
	name: string;
	url: string | null;
}
