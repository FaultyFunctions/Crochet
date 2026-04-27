export function checkProjectNameError(name: string): string | null {
	const trimmed = name.trim();

    if (trimmed.length === 0) return null; // no error shown when empty

    // Characters invalid on Windows: \ / : * ? " < > |
    // Also invalid on Unix: /
    // Also avoid null bytes
    if (/[\\/:*?"<>|\x00]/.test(trimmed)) {
        return 'Name contains invalid characters: \\ / : * ? " < > |';
    }

    // Windows doesn't allow trailing dots or spaces
    if (/[. ]$/.test(trimmed)) {
        return 'Name cannot end with a space or period.';
    }

    // Reasonable length limit (Windows MAX_PATH is 260, but just the name)
    if (trimmed.length > 100) {
        return 'Name is too long.';
    }

    return null;
}