
import { HTMLComponent, insertNode } from '@modular-cube';
import config from './CodeViewer.config.json' with { type: "json" };

import * as Examples from './data/examples.js';

import HighlightJS from 'https://cdn.jsdelivr.net/npm/highlightjs@9.16.2/+esm';

export default class CodeViewer extends HTMLComponent {
    defaultTheme = 'vs';
    cssUrl = '';

    static get observedAttributes() {
        return [
            'content',
            'language',
            'theme',
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this[name] = newValue;
    }

    async preProcess(dom) {
        super.preProcess({ config });
    }

    async toProcess(dom) {
        this.content = Examples[this.getAttribute("content")];
        this.language = this.getAttribute("language");
        this.theme = this.getAttribute("theme");

        this.cssUrl = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.16.2/styles/${this.theme ? this.theme : this.defaultTheme}.min.css`;
    }

    async atProcess(dom) {
        if (!this.content || !this.language) {
            return;
        }

        const highlightedCode = HighlightJS.highlight(
            this.language,
            this.content
        ).value;

        insertNode(
            dom,
            `
            <pre>
                <code class="hljs language-${this.language}">
                    ${highlightedCode}
                </code>
            </pre>
            `
        )
    }

    async inProcess(dom) { }
}

