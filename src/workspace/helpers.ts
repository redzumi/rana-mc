const DEBUG = false;

export const parseJson = (content: string | null): object | null => {
	try {
		return content ? JSON.parse(content.replace(/\n/g, '')) : null;
	} catch (e) {
		if (DEBUG) console.error('JSON parse error:', e);

		return null;
	}
};
