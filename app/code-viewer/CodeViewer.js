import { HTMLComponent } from '@modular-cube';
import * as Examples from '@viewer-examples';
import config from './CodeViewer.config.json' with { type: "json" };

import { HighlightJS } from './highlight/core.js';

export default class CodeViewer extends HTMLComponent {
    static observedAttributes = ["language, theme"];

    /** @type {Map<string, Promise<any>>} */
    static languageModuleCache = new Map();

    renderedContent = null;
    language = null;
    theme = null;

    defaultTheme = 'vs';
    cssUrl = '';

    async preProcess() {
        super.preProcess({ config });
    }

    async toProcess() {
        this.renderedContent = Examples[this.getAttribute("renderedContent")];
        this.language = this.getAttribute("language");
        this.theme = this.getAttribute("theme");

        this.cssUrl = `${this.getAbsolutePath()}highlight/styles/${this.theme ? this.theme : this.defaultTheme}.min.css`;
        this.prependCssContent(await this.getFileContent(this.cssUrl));

        // this.clear();        
    }

    async atProcess() {}

    async inProcess(dom) {
        await this.fetchLanguage(this.language);
    }

    getAbsolutePath() {
        let absolutePath = '';
        try {
            throw new Error();
        } catch (e) {
            const path = e.stack.split(' ').find(item => item.includes(`${this.constructor.name}.js`));
            absolutePath = path.slice(1, -1).replace(/[^/]+$/, '');
        }

        return absolutePath;
    }

    applySyntax(language) {
        const highlightedCode = HighlightJS.highlight(
            this.renderedContent,
            { language }
        ).value

        this.shadow.innerHTML += `<pre><code class="hljs language-${language}">${highlightedCode}</code></pre>`;
    }

    /**
     * Dynamically loads and registers a language for HighlightJS only once.
     * @param {string} language
     */
    async fetchLanguage(language) {
        const path = `./highlight/languages/${language}.js`;

         try {
            const module = await import(/* webpackIgnore: true */ path);
            let languageDefinition = module[language];

            if (typeof languageDefinition === 'function') {
                HighlightJS.registerLanguage(language, languageDefinition);
                this.applySyntax(this.language);
            } else {
                this.debug.error(`Could not find a valid language function export for '${language}' in module: ${module}`);
            }
        } catch (error) {
            this.debug.error(`Error importing '${language}' from ${path}: ${error}`);
        }
    }
}