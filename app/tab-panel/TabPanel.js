import { HTMLComponent } from '@modular-cube';
import { parse } from '@modular-cube';

import config from './TabPanel.config.json' with { type: "json" };

export default class TabPanel extends HTMLComponent {
    static observedAttributes = ["tabs"];
    tabs = [];

    contentToDispaly = null;

    preProcess() {
        super.preProcess({ config });
    }

    atProcess(__refDom) {
        this.tabs = parse(this.getAttribute("tabs"));
    }

    inProcess(__refDom) {
        let content = this.shadow.querySelector("#content");
        content.innerHTML += this.template;

        let tabcontent = this.shadow.querySelectorAll(".tabcontent");

        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        /*
        const tabs = this.shadow.querySelectorAll('[data-tab-id]');
        console.log(tabs);

        const values = Array.from(document.querySelectorAll('[data-tab-id]'))
        .map(el => el.getAttribute('data-tab-id'));
        console.log(tabs);
        */

        const tabToDisplay = this.shadow.querySelector(`[data-tab-id]`);
        tabToDisplay.style.display = "block";

        const tabs = this.shadow.querySelectorAll('.tab');
        if (tabs.length > 0) {
            tabs[0].classList.add('active');
        }

        const tabsEl = __refDom.querySelector('.tabs');
        const contentEl = __refDom.querySelector('.content');

        // Tab click, close, and add behavior
        __refDom.querySelector('.tabs-header').addEventListener('click', e => {
            if (e.target.classList.contains('tab')) {
                setActiveTab(e.target);
            }

            /*
            if (e.target.classList.contains('close-btn')) {
                const tab = e.target.parentElement;
                const wasActive = tab.classList.contains('active');
                tab.remove();
                if (wasActive) {
                    const newActive = __refDom.querySelector('.tab');
                    if (newActive) setActiveTab(newActive);
                    else contentEl.textContent = '';
                }
            }
            */
            /*
            if (e.target.classList.contains('add-tab')) {
                const count = __refDom.querySelectorAll('.tab').length + 1;
                const newTab = document.createElement('div');
                newTab.className = 'tab';
                newTab.draggable = true;
                newTab.innerHTML = `Tab ${count} <span class="close-btn">×</span>`;

                tabsEl.innerHTML += newTab.outerHTML;

                setActiveTab(newTab);
                tabsEl.scrollLeft = tabsEl.scrollWidth; // scroll to end
            }
            */
        });

        function setActiveTab(tab) {
            __refDom.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // contentEl.textContent = `Content of ${tab.textContent.replace('×', '').trim()}`;
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



        /**/



        const contentScroll = __refDom.getElementById('contentScroll');
        const customScroll = __refDom.getElementById('customScroll');
        const scrollTrack = __refDom.getElementById('scrollTrack');

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

    switchTabs(event, tabName) {
        const tabToDisplay = this.shadow.querySelector(`[data-tab-id=${tabName}]`);
        let tabcontent = this.shadow.querySelectorAll(".tabcontent");

        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        if (tabToDisplay) {
            tabToDisplay.style.display = "block";
            // event.currentTarget.className += " active";
        }
    }
}