import { Author } from "./workspace.d";

export class WorkspaceUtils {
	/* FYI: Just getting first mod author */
	public static getAuthor = (authors: Author[]) => {
		const author = typeof authors[0] === 'object' ? authors[0].name : authors[0];

		return author.split(',')[0].split(' ')[0].trim();
	}
}