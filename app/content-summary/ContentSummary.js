import { HTMLComponent, Observable } from '@modular-cube';
import config from './ContentSummary.config.json' with { type: "json" };

export default class ContentSummary extends HTMLComponent {

    /* --------------------------------------------
     * Life-Cycle Methods
     * -------------------------------------------- */

    async preProcess() {
        super.preProcess({ config });
    }

    async toProcess() {}

    /**
     * Injects validated HTML template into DOM and transforms specific <li> elements.
     */
    async atProcess(dom) {
        const tempWrapper = document.createElement('div');
        tempWrapper.innerHTML = this.template;

        const topLevelULs = Array.from(tempWrapper.children)
            .filter(el => el.tagName === 'UL');

        if (topLevelULs.length > 1) {
            console.warn("ContentSummary: Multiple <ul> elements found at top level.");
        }

        dom.insertAdjacentHTML('beforeend', this.template);
        this.initializeListItems(dom);
    }

    /**
     * Called after HTML is inserted. Sets colors and binds toggle behaviors.
     */
    async inProcess(dom) {
        const rootUl = dom.querySelector('ul');
        if (rootUl) {
            this.applyListColors(rootUl);
        }

        this.initializeToggleDelegation(dom);
    }

    /* --------------------------------------------
     * Initialization Helpers
     * -------------------------------------------- */

    /**
     * Transform all <li toggle> and <li scrollTo> nodes.
     */
    initializeListItems(dom) {
        const listItems = dom.querySelectorAll('li[toggle], li[scrollTo]');
        for (const li of listItems) {
            this.transformLi(li);
        }
    }

    /**
     * Attaches a single delegated click listener for all toggles.
     * This avoids adding dozens/hundreds of individual event listeners.
     */
    initializeToggleDelegation(dom) {
        dom.addEventListener('click', (event) => {
            const toggleIcon = event.target.closest('.toggle');
            if (!toggleIcon) return;

            const container = toggleIcon.closest('.toggle-container');
            if (!container) return;

            const childList = container.nextElementSibling;
            if (!childList || childList.tagName !== 'UL') return;

            const isVisible = getComputedStyle(childList).display !== 'none';
            childList.style.display = isVisible ? 'none' : 'block';
            toggleIcon.textContent = isVisible ? "▲" : "▼";
        });
    }

    /* --------------------------------------------
     * UI / Style Helpers
     * -------------------------------------------- */

    /**
     * Recursively applies color shading to nested UL/LI.
     */
    applyListColors(ul, level = 1) {
        const MAX_LEVEL = 6;
        const BASE_LIGHTNESS = 12;

        for (const li of ul.children) {
            if (li.tagName !== 'LI') continue;

            const lightness = BASE_LIGHTNESS * Math.min(level, MAX_LEVEL);
            li.style.color = `hsl(0, 0%, ${lightness}%)`;

            const nestedUls = Array.from(li.children).filter(c => c.tagName === 'UL');
            for (const nestedUl of nestedUls) {
                this.applyListColors(nestedUl, level + 1);
            }
        }
    }

    /**
     * Broadcasts navigation request to observers.
     */
    redirectTo(id) {
        Observable.publish('content-summary', id);
    }

    /* --------------------------------------------
     * LI Transformation
     * -------------------------------------------- */

    /**
     * Converts an <li> with attributes into the enhanced structure.
     */
    transformLi(li) {
        const hasToggle = li.hasAttribute('toggle');
        const scrollTo = li.getAttribute('scrollTo');

        const firstUl = li.querySelector(':scope > ul');
        const labelNodes = this.extractLabelNodes(li, firstUl);

        li.removeAttribute('toggle');
        li.removeAttribute('scrollTo');

        const wrapper = this.buildWrapper(hasToggle);
        const labelElement = this.buildLabelElement(labelNodes, hasToggle, scrollTo);

        wrapper.appendChild(labelElement);

        li.insertBefore(wrapper, firstUl || null);
    }

    /**
     * Extract all child nodes except the nested UL.
     */
    extractLabelNodes(li, excludeNode) {
        return Array.from(li.childNodes).filter(node => node !== excludeNode);
    }

    /**
     * Creates wrapper div with optional toggle class.
     */
    buildWrapper(hasToggle) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('toggle-container');
        if (!hasToggle) wrapper.classList.remove('toggle-container'); // Remove if not needed
        return wrapper;
    }

    /**
     * Creates the <p> label component including toggle icon + scrollTo span.
     */
    buildLabelElement(labelNodes, hasToggle, scrollTo) {
        const p = document.createElement('p');

        if (hasToggle) {
            p.appendChild(this.buildToggleIcon());
            p.appendChild(document.createTextNode(' '));
        }

        if (scrollTo) {
            p.appendChild(this.createClickableLabel(labelNodes, scrollTo));
        } else {
            for (const node of labelNodes) p.appendChild(node);
        }

        return p;
    }

    /**
     * Toggle icon DOM.
     */
    buildToggleIcon() {
        const icon = document.createElement('span');
        icon.classList.add('toggle');
        icon.textContent = '▼';
        return icon;
    }

    /**
     * Wraps text nodes into a clickable span for scroll/navigation.
     */
    createClickableLabel(nodes, scrollTo) {
        let clickable = null; // created only when needed
        const fragment = document.createDocumentFragment();

        for (const node of nodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                if (!clickable) {
                    clickable = document.createElement('span');
                    clickable.setAttribute('clickEvent', `redirectTo('${scrollTo}')`);
                }

                clickable.appendChild(node);
            }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                fragment.appendChild(node);
            }
        }

        // Build final fragment
        const output = document.createDocumentFragment();
        // Only if it has content
        if (clickable) output.appendChild(clickable);   
        output.appendChild(fragment);

        return output;
    }
}