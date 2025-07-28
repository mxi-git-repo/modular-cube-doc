import { HTMLComponent, Observable } from '@modular-cube';
import { stringify } from '@modular-cube';
import { int, float, number } from '@modular-cube';

import config from './AppRoot.config.json' with { type: "json" };

export default class AppRoot extends HTMLComponent {
    tabNames = stringify(['Javascript', 'HTML-Markup', 'CSS-Styles', 'Preview-Source-Code']);
    configTabNames = stringify(['Javascript', 'Config']);
    displayTab = stringify(['Config']);
    javascriptTab = stringify(['Javascript']);
    htmlTab = stringify(['HTML-Markup']);

    preProcess() {
        super.preProcess({ config });
    }

    toProcess() {}

    atProcess() {}

    inProcess(dom) {
        const resizable = dom.querySelector('#resizable');
        const resizer = resizable.querySelector('.resizer');
        const resizableContent = resizable.querySelector('.expandable');
        const badge = dom.querySelector('.badge');

        /* */
        const outline = dom.querySelector('.outline');
        const style = window.getComputedStyle(outline);
        const minWidth = parseFloat(style.minWidth); // returns a string like "100"

        let isResizing = false;
        let containerWidth = resizable.offsetWidth;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.userSelect = 'none';
        });

        resizable.addEventListener('dblclick', () => {
            this.lerp(resizable.offsetWidth, containerWidth, 100, (currentPx) => {
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
            if (!isResizing) return;

            const containerRect = dom.host.getBoundingClientRect();;
            const newWidth = Math.min(
                Math.max(e.clientX - containerRect.left, minWidth),
                containerWidth
            );

            resizable.style.width = `${newWidth}px`;
            const shouldHide = newWidth <= minWidth;
            resizableContent.style.overflowY = shouldHide ? 'hidden' : 'auto';
            resizableContent.style.visibility = shouldHide ? 'hidden' : 'visible';
            // badge.style.display = shouldHide ? 'none' : 'block';
        });

        dom.addEventListener('blur', () => {
            isResizing = false;
            document.body.style.userSelect = '';
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.body.style.userSelect = '';
        });

        window.addEventListener('resize', () => {
            containerWidth = dom.querySelector('#ref_resizable').offsetWidth;
        });

        Observable.subscribe('content-summary', (id) => {
            const target = dom.querySelector(`#${id}`);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    lerp(start, end, duration, onUpdate, onComplete) {
        const delta = end - start;
        let startTime = null;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1); // Clamp to [0, 1]

            const current = start + delta * progress;
            onUpdate(current); // Callback with current value

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (onComplete) onComplete();
            }
        }

        requestAnimationFrame(animate);
    }
}
