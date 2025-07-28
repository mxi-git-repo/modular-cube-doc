import { HTMLComponent } from "@modular-cube";
import config from './MermaidViewer.config.json' with { type: "json" };

import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10.9.8/dist/mermaid.esm.min.mjs';

export default class MermaidViewer extends HTMLComponent {
    async preProcess() {
        super.preProcess({ config });
    }

    async toProcess(dom) { }

    async atProcess(dom) {
        try {
            mermaid.initialize({ 
                startOnLoad: false, 
                theme: "base",
                themeVariables: { 
                    background: "#f8fafc", 
                    primaryColor: "#ecfdf5", 
                    primaryTextColor: "#064e3b", 
                    primaryBorderColor: "#10b981", 
                    secondaryColor: "#fff7ed", 
                    secondaryTextColor: "#9a3412", 
                    secondaryBorderColor: "#f59e0b", 
                    tertiaryColor: "#eef2ff", 
                    tertiaryTextColor: "#3730a3", 
                    tertiaryBorderColor: "#6366f1", 
                    lineColor: "#94a3b8", 
                    textColor: "#1e293b", 
                    clusterBkg: "#ffffff", 
                    clusterBorder: "#cbd5e1", 
                    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", fontSize: "24px" 
                }, 
                flowchart: { 
                    nodeSpacing: 100, 
                    rankSpacing: 60, 
                    curve: "basis", 
                    padding: 20 
                } 
            });

            const code = this.template.text;
            const { svg } = await mermaid.render('m-' + crypto.randomUUID(), this.normalizeMermaidCode(code));

            this.shadowRoot.innerHTML = svg;
        } catch (error) {
            console.error(error)
        }

    }

    async inProcess(dom) { }

    normalizeMermaidCode(input) {
        return (input ?? '')
            .trim()
            .replaceAll('&gt;', '>')
            .replaceAll('&lt;', '<')
            .replaceAll('&amp;', '&');
    }
}