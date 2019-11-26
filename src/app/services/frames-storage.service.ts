import { Injectable } from '@angular/core';

const FIGMA_KEY = 'figma';

@Injectable()
export class FramesStorage {
    cache = {};

    constructor() {
        const figma = localStorage.getItem(FIGMA_KEY);
        if (!!figma) {
            this.cache = JSON.parse(figma);
        }
    }


    set(file: string, node: string, data: { [key: string]: any } = {}) {
        if (!this.cache[file]) {
            this.cache[file] = {};
        }

        this.cache[file][node] = data;
        this.flush();
    }

    get(file: string, node: string) {
        return !!this.cache[file] ? this.cache[file][node] : null;
    }

    exists(file: string, node: string) {
        return !!this.cache[file] && !!this.cache[file][node];
    }

    flush() {
        localStorage.setItem(FIGMA_KEY, JSON.stringify(this.cache));
    }
}
