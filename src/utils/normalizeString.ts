interface Options {
	slugfy?: boolean;
}
const defaultOptions: Options = {
	slugfy: false,
};

export function normalizeString(string: string, options: Options = defaultOptions) {
	if (!string || typeof string !== 'string') return '';
	const optionsPlusDefault = { ...defaultOptions, ...options };
	const { slugfy } = optionsPlusDefault;

	string = string
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
	if (slugfy) {
		string = string.replace(/[ \t]+/g, '-');
	}
	return string;
}
