const requestOptions: RequestInit = {
	method: "GET",
	redirect: "follow"
};

const DELAY = 500;

const fetchData = (url: string) => fetch(url, requestOptions).then(res => res.text());

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchWithDelay = async (urls: string[]) => {
	const results: string[] = [];

	for (const url of urls) {
		await delay(DELAY);
		results.push(await fetchData(url));
	}

	return results;
};

const API_HOST = "api.modrinth.com"; // FYI: or staging-api.modrinth.com

interface License {
	id: string;
	name: string;
	url: string | null;
}

export interface ModProjectResponse {
	client_side: "required" | "optional" | "unsupported";
	server_side: "required" | "optional" | "unsupported";
	game_versions: string[];
	id: string;
	slug: string;
	project_type: "mod" | "resource_pack" | "data_pack";
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
	status: "approved" | "pending" | "rejected";
	requested_status: "approved" | "pending" | "rejected";
	moderator_message: string | null;
	license: License;
	downloads: number;
	followers: number;
	categories: string[];
	additional_categories: string[];
	loaders: ("fabric" | "forge" | "neoforge")[];
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
	monetization_status: "monetized" | "not_monetized";
}

export const getProjectUrl = (slugOrId: string) =>
	`https://${API_HOST}/v2/project/${encodeURIComponent(slugOrId)}`;
