declare const __APP_VERSION__: string;

export const PROJECT_FILE_VERSION = 1;
export const APP_VERSION = __APP_VERSION__;
export const IS_ALPHA = APP_VERSION.toLowerCase().includes('alpha');
export const IS_BETA = APP_VERSION.toLowerCase().includes('beta');
export const IS_STABLE = !IS_ALPHA && !IS_BETA;
