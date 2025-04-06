import { FacetGroup } from "./facets";

export class ModrinthUtils {
	public static getSearchFacets = (facetGroups: FacetGroup[]): string => {
		const encoded = facetGroups.map(group =>
			'[' + group
				.map(({ key, operator = ':', value }) =>
					JSON.stringify(`${key}${operator}${value}`)
				)
				.join(',') + ']'
		);

		return `[${encoded.join(',')}]`;
	};
}