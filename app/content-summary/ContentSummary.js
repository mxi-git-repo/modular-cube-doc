import { HTMLComponent, Observable } from '@modular-cube';
import config from './ContentSummary.config.json' with { type: "json" };

export default class ContentSummary extends HTMLComponent {
    preProcess() {
        super.preProcess({ config });
    }

    toProcess() { }

    atProcess() { }

    inProcess(dom) {
        const rootUl = dom.querySelector('.nested');
        if (rootUl) {
            this.setListColors(rootUl);
        }

        dom.querySelectorAll('.nested .toggle-container').forEach(toggle => {
            const t = toggle.querySelector('.toggle');

            t.addEventListener('click', function () {
                // Get the next sibling (the <ul>) and toggle it
                const childList = toggle.nextElementSibling;

                if (childList && childList.tagName.toLowerCase() === 'ul') {
                    const isVisible = getComputedStyle(childList).display === 'block';

                    childList.style.display = isVisible ? 'none' : 'block';
                    t.textContent = isVisible ? "▲" : "▼";
                }
            });
        });
    }

    setListColors(ul, level = 1) {
        const lightnessBase = 15;

        for (const li of ul.children) {
            if (li.tagName === 'LI') {
                // Calculate lightness
                const lightness = lightnessBase * level;

                // Apply color directly using HSL
                li.style.color = `hsl(0, 0%, ${lightness}%)`;

                // Look for any <ul> nested inside this <li>
                const nestedUls = Array.from(li.children).filter(child => child.tagName === 'UL');
                for (const nestedUl of nestedUls) {
                    this.setListColors(nestedUl, level < 6 ? level + 1 : 6);
                }
            }
        }
    }

    redirectTo(id) {
        Observable.publish('content-summary', id);
    }
}