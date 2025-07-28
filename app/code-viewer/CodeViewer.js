import { HTMLComponent } from '@modular-cube';
import config from './CodeViewer.config.json' with { type: "json" };

import { HighlightJS } from './highlight/core.js';

export default class CodeViewer extends HTMLComponent {
    static observedAttributes = ["language, theme"];

    language = null;
    theme = null;

    defaultTheme = 'vs';
    cssUrl = '';

    preProcess() {
        super.preProcess({ config });
    }

    async atProcess(__refDom) {
        const instances = this.findAllCustomParents(this);
        let rawSnippet = ``;

        for (const instance of instances) {
            const snippet = this.getInstance(instance?.rawHTML);
            if (snippet) {
                rawSnippet = snippet;
                break; // Stop the loop — we found what we need
            }
        }

        if (!rawSnippet) {
            rawSnippet = this.getInstance(document.documentElement.outerHTML);
        }

        // TODO Refactor
        this.renderedContent = this.removeFirstEmptyLine(this.removeLeadingWhitespace(rawSnippet));

        this.language = this.getAttribute("language");
        this.theme = this.getAttribute("theme");

        // this.cssUrl = `${this.getAbsolutePath()}/highlight/styles/${this.theme ? this.theme : this.defaultTheme}.min.css`;

        this.clear();

        await this.fetchLanguage(this.language);
    }

    inProcess(__refDom) {

    }

    /*
    getAbsolutePath() {
        let absolutePath = '';
        try {
            throw new Error();
        } catch (e) {
            const path = e.stack.split(' ').find(item => item.includes(`${this.constructor.name}.js`));
            absolutePath = path.slice(1, -1).replace(/[^/]+$/, '');
        }

        return absolutePath.replace("http://", "https://");
    }
    */

    applySyntax(language) {
        const highlightedCode = HighlightJS.highlight(
            this.renderedContent,
            { language }
        ).value

        this.shadow.innerHTML += `<pre><code class="hljs language-${language}">${highlightedCode}</code></pre>`;
    }

    findNearestCustomParent(element) {
        let node = element;
        while (node) {
            node = node.getRootNode().host || node.parentNode;
            if (node instanceof HTMLElement && node.tagName.includes('-')) {
                return node;
            }
        }
        return null;
    }

    findAllCustomParents(element) {
        const customParents = [];
        let node = element;

        while (node) {
            node = node.getRootNode().host || node.parentNode;

            if (node instanceof HTMLElement && node.tagName.includes('-')) {
                customParents.push(node);
            }
        }

        return customParents;
    }

    /**
     * Extracts the inner content of the first <code-viewer> tag
     * that matches the instance's UUID.
     *
     * @param rawContent - The raw HTML string to search within.
     * @returns The inner content of the matching <code-viewer> tag, or null if not found.
     * @throws If `this.uuid` is not set.
     */
    getInstance(rawContent) {
        if (!this.uuid) {
            throw new Error("UUID is not set on the instance.");
        }

        // Regular expression to find a <code-viewer> element with the matching UUID.
        // It supports both single and double quotes around the uuid value.
        // The second capture group contains the inner content between the tags.
        const regex = new RegExp(
            `<code-viewer[^>]*\\buuid=(["'])${this.uuid}\\1[^>]*>([\\s\\S]*?)<\\/code-viewer>`,
            'i' // Case-insensitive, stops after the first match
        );

        const match = regex.exec(rawContent);

        // If a match is found, return the captured inner content; otherwise, return null.
        return match ? match[2] : null;
    }

    removeLeadingWhitespace(input) {
        if (!input) { return; }

        // Split the input string by newlines
        const lines = input.split('\n');

        // Skip the first line if it contains only a carriage return (empty or \r line)
        let startLine = 0;
        if (lines[0] === '' || lines[0] === '\r') {
            startLine = 1; // Start processing from the second line
        }

        // Get the first non-empty line or the next line with content
        const firstLine = lines[startLine];

        // Calculate the leading whitespace of the first valid line
        const leadingWhitespace = firstLine.match(/^(\s*)/)[0].length;

        // Remove the same amount of whitespace from the beginning of every line
        const result = lines.map(line => line.slice(leadingWhitespace)).join('\n');

        return result;
    }

    removeFirstEmptyLine(str) {
        // Normalize line endings and split into lines
        const lines = str.replace(/\r\n?/g, '\n').split('\n');

        // Check if the first line is empty (including whitespace)
        if (lines[0].trim() === '') {
            lines.shift(); // Remove the first line
        }

        // Join the lines back
        return lines.join('\n');
    }

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
