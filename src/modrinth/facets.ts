type FacetOperator = ':' | '!=' | '>=' | '<=' | '>' | '<';

type FacetKey =
	| 'project_type'
	| 'categories'
	| 'versions'
	| 'client_side'
	| 'server_side'
	| 'open_source'
	| 'title'
	| 'author'
	| 'follows'
	| 'project_id'
	| 'license'
	| 'downloads'
	| 'color'
	| 'created_timestamp'
	| 'modified_timestamp';

interface FacetCondition {
	key: FacetKey;
	operator?: FacetOperator; // default is ":"
	value: string | number;
}

export type FacetGroup = FacetCondition[];

export class Facets {
	static equals(key: FacetKey, value: string | number): FacetCondition {
		return { key, value };
	}

	static notEquals(key: FacetKey, value: string | number): FacetCondition {
		return { key, operator: '!=', value };
	}

	static gte(key: FacetKey, value: number): FacetCondition {
		return { key, operator: '>=', value };
	}

	static lte(key: FacetKey, value: number): FacetCondition {
		return { key, operator: '<=', value };
	}

	static gt(key: FacetKey, value: number): FacetCondition {
		return { key, operator: '>', value };
	}

	static lt(key: FacetKey, value: number): FacetCondition {
		return { key, operator: '<', value };
	}
}