import { HTMLComponent, Observable, tween, stringify } from '@modular-cube';
import config from './AppRoot.config.json' with { type: "json" };

export default class AppRoot extends HTMLComponent {
    tabNames = stringify(['MyComponent.js', 'MyComponent.html', 'MyComponent.css', 'MyComponent.config.json']);
    
    isResizing = false;
    scrollId;
    expression = "${this.expression}";
    forExpression = 'forEach="${item} in ${this.items}"';
    forExpressionItem = '${item}';

    async preProcess() {
        super.preProcess({ config });
    }

    async toProcess() { }

    async atProcess(dom) {
        dom.insertAdjacentHTML('beforeend', this.template);
    }

    async inProcess(dom) {
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

            const shouldHide = newWidth <= minWidth;
            resizable.style.width = `${newWidth}px`;
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

        // Navigation bar
        const nav = dom.querySelector('.navigation');
        // Initialize: mark the first <a> as active
        const firstLink = nav.querySelector('a');

        if (firstLink) firstLink.classList.add('active');

        // Handle clicks
        nav.addEventListener('click', (e) => {
            const link = e.target.closest('a');

            if (!link) return;
            nav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
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

    disconnectedCallback() {
        super.disconnectedCallback();
    }
}