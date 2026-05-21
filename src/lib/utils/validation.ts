import { type } from '@tauri-apps/plugin-os';
import { escapeHTML } from 'fast-escape-html';

// eslint-disable-next-line no-control-regex
const fileNameDisallowedSymbolsRegex: RegExp = /[<>:"/\\|?*\u0000-\u001F].*/;
const windowsReservedNameRegex: RegExp = /^(con|prn|aux|nul|com\d|lpt\d)$/i;
const leadingWhitespaceRegex: RegExp = /^\s/;

// Checks if the name is valid
// Returns null if valid, otherwise returns an error string
export const checkProjectNameError = (name: string): string | null => {
	if (name.length === 0) return null;

	if (leadingWhitespaceRegex.test(name)) {
		return "Your project's name cannot have any leading whitespaces.";
	}

	if (fileNameDisallowedSymbolsRegex.test(name)) {
		return `The name <span class="font-bold">${escapeHTML(name)}</span> contains invalid characters.`;
	}

	if (type() === 'windows' && windowsReservedNameRegex.test(name)) {
		return `The name <span class="font-bold">${escapeHTML(name)}</span> is a name reserved by Windows. Please choose a different name.`;
	}
	if (name.length > 100) {
		return "Your project's name is too long.";
	}

	return null;
};

export const checkFileNameError = (name: string): string | null => {
	if (name.length === 0) {
		return 'A file or folder name must be provided.';
	}

	if (leadingWhitespaceRegex.test(name)) {
		return "Your file or folder's name cannot have any leading whitespaces.";
	}

	if (fileNameDisallowedSymbolsRegex.test(name)) {
		return `The name <span class="font-bold">${escapeHTML(name)}</span> contains invalid characters.`;
	}

	if (type() === 'windows' && windowsReservedNameRegex.test(name)) {
		return `The name <span class="font-bold">${escapeHTML(name)}</span> is a name reserved by Windows. Please choose a different name.`;
	}
	if (name.length > 100) {
		return "Your file or folder's name is too long.";
	}

	return null;
};

console.log();
