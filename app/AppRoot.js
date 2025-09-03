import { HTMLComponent, Observable, tween, stringify } from '@modular-cube';
import config from './AppRoot.config.json' with { type: "json" };

export default class AppRoot extends HTMLComponent {
    tabNames = stringify(['Javascript', 'HTML-Markup', 'CSS-Styles', 'Preview-Source-Code']);
    configTabNames = stringify(['Javascript', 'Config']);
    displayTab = stringify(['Config']);
    javascriptTab = stringify(['Javascript']);
    htmlTab = stringify(['HTML-Markup']);
    isResizing = false;
    scrollId;

    preProcess() {
        super.preProcess({ config });
    }

    toProcess() { }

    async atProcess() { }

    inProcess(dom) {
        const resizable = dom.querySelector('#resizable');
        const resizableContent = resizable.querySelector('#expandable');
        const outline = dom.querySelector('#outline');
        const minWidth = parseFloat(window.getComputedStyle(outline).minWidth);
        let containerWidth = resizable.offsetWidth;

        resizable.addEventListener('dblclick', () => {
            tween(resizable.offsetWidth, containerWidth, 100, (currentPx) => {
                resizable.style.width = `${currentPx}px`;
            }, () => {
                // Snap to 20% at the end
                resizable.style.width = '20%';
            });

            // Display the content
            resizableContent.style.overflowY = 'auto';
            resizableContent.style.visibility = 'visible';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isResizing) return;

            const containerRect = dom.host.getBoundingClientRect();;
            const newWidth = Math.min(
                Math.max(e.clientX - containerRect.left, minWidth),
                containerWidth
            );

            resizable.style.width = `${newWidth}px`;

            const shouldHide = newWidth <= minWidth;
            resizableContent.style.overflowY = shouldHide ? 'hidden' : 'auto';
            resizableContent.style.visibility = shouldHide ? 'hidden' : 'visible';
        });

        document.addEventListener('mouseup', () => {
            this.endResize();
        });

        window.addEventListener('resize', () => {
            containerWidth = dom.querySelector('#ref_resizable').offsetWidth;
        });

        Observable.subscribe('content-summary', (id) => {
            this.scrollId = id;
            this.scrollToSectionWhenReady(dom, id);
        });
    }



    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();

        if (!rect) return false;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return rect.top < windowHeight && rect.bottom > 0 && rect.left < windowWidth && rect.right > 0;
    }



    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    async scrollToSectionWhenReady(dom, id, delayMs = 1000) {
        const target = dom.querySelector(`#${id}`);

        if (!target) {
            console.warn(`No target found for id: ${id}`);
            return;
        }

        while (this.scrollId === id && !this.isElementInViewport(target)) {
            target.scrollIntoView({ behavior: 'smooth' });
            await this.delay(delayMs);
        }

        // Final scroll to ensure visibility
        if (this.scrollId === id && this.isElementInViewport(target)) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    startResize() {
        this.isResizing = true;
        document.body.style.userSelect = 'none';
    }

    endResize() {
        this.isResizing = false;
        document.body.style.userSelect = '';
    }
}