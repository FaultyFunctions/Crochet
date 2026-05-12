import { family } from '@tauri-apps/plugin-os';

export const PROJECT_FILE_VERSION = 1;
export const IS_WINDOWS = family() === 'windows';
export const PATH_SEPARATOR = IS_WINDOWS ? '\\' : '/';
