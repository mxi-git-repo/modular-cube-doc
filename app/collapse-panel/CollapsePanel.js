import { HTMLComponent } from '@modular-cube';
import config from './CollapsePanel.config.json' with { type: "json" };

export default class CollapsePanel extends HTMLComponent {
    static observedAttributes = ["title"];
    title = "";

    preProcess() {
        super.preProcess({ config });
    }

    toProcess() { }

    async atProcess() {
        this.title = this.getAttribute("title");
    }

    inProcess(dom) {
        let content = this.shadow.querySelector("#content");
        // content.innerHTML += this.template;
        content.insertAdjacentHTML('beforeend', this.template);

        dom.querySelectorAll('.collapse-container').forEach(container => {
            const header = container.querySelector('.collapse-header');
            const content = container.querySelector('.collapse-content');
            const inner = container.querySelector('.collapse-content-inner');
            const toggleBtn = container.querySelector('.toggle-btn');
            const icon = container.querySelector('.icon');
            let isOpen = true;

            // init state
            icon.style.background = '#41e179';

            header.addEventListener('click', () => {
                if (!isOpen) {
                    content.style.height = inner.scrollHeight + 'px';
                    toggleBtn.textContent = '−';
                    content.addEventListener('transitionend', function autoHeight() {
                        if (isOpen) content.style.height = 'auto';
                        content.removeEventListener('transitionend', autoHeight);
                    });

                    icon.style.background = '#41e179';
                } else {
                    content.style.height = content.scrollHeight + 'px';
                    void content.offsetHeight; // force reflow
                    content.style.height = '0px';
                    toggleBtn.textContent = '+';
                    icon.style.background = '#999';
                }

                isOpen = !isOpen;
            });
        });
    }
}