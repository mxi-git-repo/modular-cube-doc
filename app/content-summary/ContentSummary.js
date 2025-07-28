import { HTMLComponent, Observable } from '@modular-cube';
import config from './ContentSummary.config.json' with { type: "json" };

export default class ContentSummary extends HTMLComponent {
    preProcess() {
        super.preProcess({ config });
    }

    atProcess() { }

    inProcess(dom) {
        const rootUl = dom.querySelector('.nested');
        if (rootUl) {
            this.setListColors(rootUl);
        }
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