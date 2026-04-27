// Checks if the name is valid
// Returns null if valid, otherwise returns an error string
export function checkProjectNameError(name: string): string | null {
	const trimmed = name.trim();

    // If empty string, no error
    if (trimmed.length === 0) return null;

    // Invalid characters
    if (/[\\/:*?"<>|\x00]/.test(trimmed)) {
        return 'Name contains invalid characters: \\ / : * ? " < > |';
    }

    // No trailing dots
    if (/[. ]$/.test(trimmed)) {
        return 'Name cannot end with a space or period.';
    }

    // Name length
    if (trimmed.length > 100) {
        return 'Name is too long.';
    }

    return null;
}