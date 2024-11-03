import { OpenAI } from 'openai';
let openai: OpenAI | null = null;

export function initOpenAI(baseURL: string, apiKey: string) {
    if (!openai) {
        openai = new OpenAI({ baseURL: baseURL, apiKey: apiKey });
    }
    return openai;
}
export function getOpenAI(): OpenAI | null {
    return openai;
}
