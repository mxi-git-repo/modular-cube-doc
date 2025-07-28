import { HTMLComponent, parse } from '@modular-cube';

import config from './TabPanel.config.json' with { type: "json" };

export default class TabPanel extends HTMLComponent {
    static observedAttributes = ["tabs"];
    tabs = [];

    contentToDispaly = null;

    async preProcess() {
        super.preProcess({ config });
    }

    async toProcess(dom) {
        try {
            console.log(this.getAttribute("tabs"));
            this.tabs = parse(this.getAttribute("tabs"));
        } catch (error) {
            console.log(error)
        }
        
    }

    async atProcess(dom) {
        let content = this.shadowRoot.querySelector("#content");
        content.insertAdjacentHTML('beforeend', this.template.text);

        let tabcontent = this.shadowRoot.querySelectorAll(".tabcontent");

        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        const tabToDisplay = this.shadowRoot.querySelector(`[data-tab-id]`);
        tabToDisplay.style.display = "block";

        const tabs = this.shadowRoot.querySelectorAll('.tab');
        if (tabs.length > 0) {
            tabs[0].classList.add('active');
        }

        const tabsEl = dom.querySelector('.tabs');
        const contentEl = dom.querySelector('.content');

        // Tab click, close, and add behavior
        dom.querySelector('.tabs-header').addEventListener('click', e => {
            if (e.target.classList.contains('tab')) {
                setActiveTab(e.target);
            }
        });

        function setActiveTab(tab) {
            dom.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        }

        // Drag-and-drop for reordering
        let dragSrc = null;

        tabsEl.addEventListener('dragstart', e => {
            if (e.target.classList.contains('tab')) dragSrc = e.target;
        });

        tabsEl.addEventListener('dragover', e => {
            e.preventDefault();
            const target = e.target.closest('.tab');
            if (target && target !== dragSrc) {
                const bounding = target.getBoundingClientRect();
                const offset = e.clientX - bounding.left;
                tabsEl.insertBefore(dragSrc, offset > bounding.width / 2 ? target.nextSibling : target);
            }
        });

        const contentScroll = dom.getElementById('contentScroll');
        const customScroll = dom.getElementById('customScroll');
        const scrollTrack = dom.getElementById('scrollTrack');

        function updateScrollTrack() {
            const visibleRatio = contentScroll.clientWidth / contentScroll.scrollWidth;
            const trackWidth = Math.max(visibleRatio * customScroll.clientWidth, 30);

            scrollTrack.style.width = `${trackWidth}px`;
            updateScrollTrackPosition();

            // Hide track if no scroll needed
            customScroll.style.display = (visibleRatio >= 1) ? 'none' : 'block';
        }

        function updateScrollTrackPosition() {
            const scrollRatio = contentScroll.scrollLeft / (contentScroll.scrollWidth - contentScroll.clientWidth);
            const maxLeft = customScroll.clientWidth - scrollTrack.offsetWidth;
            scrollTrack.style.left = `${scrollRatio * maxLeft}px`;
        }

        // Drag support
        let isDragging = false;
        let startX = 0;
        let startLeft = 0;

        scrollTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startLeft = parseFloat(scrollTrack.style.left) || 0;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const delta = e.clientX - startX;
            const maxLeft = customScroll.clientWidth - scrollTrack.offsetWidth;
            const newLeft = Math.min(Math.max(0, startLeft + delta), maxLeft);

            scrollTrack.style.left = `${newLeft}px`;
            const scrollRatio = newLeft / maxLeft;
            contentScroll.scrollLeft = scrollRatio * (contentScroll.scrollWidth - contentScroll.clientWidth);
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });

        // Mouse wheel support (convert vertical scroll to horizontal)
        contentScroll.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                contentScroll.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        // Sync scroll with scrollbar
        contentScroll.addEventListener('scroll', updateScrollTrackPosition);

        // ResizeObserver to watch layout changes
        const resizeObserver = new ResizeObserver(updateScrollTrack);
        resizeObserver.observe(contentScroll);

        // MutationObserver to detect added/removed tabs
        const mutationObserver = new MutationObserver(updateScrollTrack);
        mutationObserver.observe(contentScroll, { childList: true, subtree: true });

        // Initialize
        window.addEventListener('load', updateScrollTrack);
        window.addEventListener('resize', updateScrollTrack);
    }

    inProcess() { }

    switchTabs(event, tabName) {
        const tabToDisplay = this.shadowRoot.querySelector(`[data-tab-id="${tabName}"]`);
        let tabcontent = this.shadowRoot.querySelectorAll(".tabcontent");

        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        if (tabToDisplay) {
            tabToDisplay.style.display = "block";
        }
    }
}