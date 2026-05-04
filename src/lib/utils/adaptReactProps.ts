const PROP_RENAMES: Record<string, string> = {
	tabIndex: 'tabindex',
	className: 'class',
	htmlFor: 'for',
	onDoubleClick: 'ondblclick'
};

export function adaptReactProps(props: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(props)) {
		if (key in PROP_RENAMES) {
			out[PROP_RENAMES[key]] = value;
		} else if (/^on[A-Z]/.test(key)) {
			out[key.toLowerCase()] = value;
		} else {
			out[key] = value;
		}
	}
	return out;
}
