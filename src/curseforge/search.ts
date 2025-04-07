import qs from 'qs';

import {
	ClassIds,
	GameIds,
	ModLoaderType,
	ModsSearchSortField,
	SortOrder,
} from './constants';

export class CurseforgeSearch {
	private params = {};

	gameId(id: GameIds) {
		this.params['gameId'] = id;

		return this;
	}

	sortField(field: ModsSearchSortField) {
		this.params['sortField'] = field;

		return this;
	}

	modLoaderType(type: ModLoaderType) {
		this.params['modLoaderType'] = type;

		return this;
	}

	classId(id: ClassIds) {
		this.params['classId'] = id;

		return this;
	}

	searchFilter(filter: string) {
		this.params['searchFilter'] = filter;

		return this;
	}

	sortOrder(order: SortOrder) {
		this.params['sortOrder'] = order;

		return this;
	}

	get() {
		return qs.stringify(this.params);
	}
}
