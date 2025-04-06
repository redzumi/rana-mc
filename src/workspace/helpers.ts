export const parseJson = (content: string | null): object | null => {
	try {
		return content ? JSON.parse(content) : null;
	} catch (e) {
		console.error('JSON parse error:', e);

		return null;
	}
};