import { detectLanguage } from 'src/utils/lang';
import { Language } from './enums/language';

export const BASE_URI = 'https://www.specprojector.com';
export const UI_DELAY = 250;

const language = detectLanguage();
export const languageProvider = {
    provide: Language,
    useValue: language
};
