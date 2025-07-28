export const COMPONENT_CONFIG_STRUCTURE = `
    {
        "name": "my-component",         # Name of the component tag.
        "descripttion": "",             # Optional description for documentation or metadata.
        "files": {
            "html": {
                "path": ""              # Path to the component’s HTML template.
            },
            "css": {
                "path": ""              # Path to the CSS styles for the component.
            }
        },
        "behavior": {
            "apendToBody": false,       # Indicates whether the component should be appended to the body tag automatically at load time.
            "lazyLoading": false,       # Enables deferred loading of components until they are needed.
            "debug": false              # Enables debug mode for logging and diagnostics.
        }
    }

`;

export const COMPONENT_CLASS_STRUCTURE = `
    import { HTMLComponent } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    // Define a new component by extending the base HTMLComponent class
    export default class MyComponent extends HTMLComponent {
        // Called before the component is fully processed
        // Typically used to load configuration (HTML, CSS, behavior settings, etc.)
        async preProcess() {
            super.preProcess({ config });
        }
        
        // Called early in the component lifecycle
        // Can be used to set up initial properties or prepare internal state
        async toProcess() { 
            // Add early setup logic here
        }

        // Called asynchronously during processing
        // Suitable for tasks like fetching data or performing async operations
        async atProcess(dom) { 
            // Add async logic here
        }
        
        // Called after the component’s DOM has been created
        // Provides access to the shadow DOM for manipulation or event binding
        async inProcess(dom) {
            // Example: dom.querySelector('.button').addEventListener('click', ...)
        }
    }

`;

export const TOPROCESS_STATE = `
    // Called early in the component lifecycle
    // Can be used to set up initial properties or prepare internal state
    async toProcess() { 
        // Add early setup logic here
    }

`;

export const ATPROCESS_STATE = `
    // Called asynchronously during processing
    // Suitable for tasks like fetching data or performing async operations
    async atProcess(dom) { 
        // Add async logic here
    }

`;

export const INPROCESS_STATE = `
    // Called after the component’s DOM has been created
    // Provides access to the shadow DOM for manipulation or event binding
    async inProcess(dom) {
        // Example: dom.querySelector('.button').addEventListener('click', ...)
    }

`;

export const ADOPTED_CALLBACK_ = `
    /**
     * Called when the element is moved to a new document.
     * For example, between iframes or windows.
     */
    adoptedCallback() {
        // console.log('Custom square element moved to new page.');
    }

`;

export const ATTRIBUTE_CHANGED_CALLBACK = `
    /**
     * Called when one of the element's observed attributes changes.
     *
     * @param {string} name - The name of the attribute that changed.
     * @param {string | null} oldValue - The previous value of the attribute.
     * @param {string | null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) { }
    
`;

export const DISCONNECTED_CALLBACK = `
    /**
     * Called automatically when the component is removed from the DOM.
     * Use this method to clean up resources such as event listeners,
     * intervals, observers, or any external references.
     */
    disconnectedCallback() { }
    
`;

export const APPLICATION_CONFIG_STRUCTURE = `
    {
        "modularCube": {
            "application": {
                "name": "app-root",       ➝ # Name of the component tag.
                "descripttion": "",       ➝ # Optional description for documentation or metadata.
                "files": {
                    "html": {
                        "path": ""        ➝ # Path to the component’s HTML template.
                    },
                    "css": {
                        "path": ""        ➝ # Path to the CSS styles for the component.
                    }
                },
                "behavior": {
                    "apendToBody": false, ➝ # Indicates whether the component should be appended to the body tag automatically at load time.
                    "lazyLoading": false, ➝ # Enables deferred loading of components until they are needed.
                    "debug": false        ➝ # Enables debug mode for logging and diagnostics.
                }
            },
            "components": [
                # tag: The custom element tag name used to register the component.Must follow kebab-case format.
                # path: The path to the JavaScript module that defines the component.

                {
                    "tag": "app-root",
                    "path": "./app/AppRoot.js"
                },
                {
                    "tag": "content-summary",
                    "path": "./app/content-summary/ContentSummary.js"
                },
                {
                    "tag": "collapse-panel",
                    "path": "./app/collapse-panel/CollapsePanel.js"
                },
                {
                    "tag": "tab-panel",
                    "path": "./app/tab-panel/TabPanel.js"
                },
                {
                    "tag": "code-viewer",
                    "path": "./app/code-viewer/CodeViewer.js"
                }
            ]
        }
    }

`;

export const APPLICATION_INITIALIZATION = `
    /* Default initialization */
    import { Dom } from '@modular-cube';

    await Dom.init(() => {
        // App initialized after DOM is ready
    });

`;

export const APPLICATION_INITIALIZATION_WITH_PARAMETER = `
    /* Inline component registration */
    import { Dom } from '@modular-cube';

    await Dom.init(([
        { tag: 'my-component', type: MyComponent }
    ]) => {
        // App initialized after DOM is ready
    });

`;

export const APPLICATION_INITIALIZATION_WITH_CONFIF_FILE = `
    /* Initialization with a configuration file */
    await Dom.init(('./configs/app.config.json') => {
        // App initialized after DOM is ready
    });

`;

export const APPLICATION_ENTRY_POINT = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Modular App</title>
        <!--
            Import map for the Modular Cube library. 
            Provides the base HTMLComponent class and utility functions required by all components. 
        -->
        <script type="importmap">
            {
                "imports": {
                    "@modular-cube": "https://cdn.jsdelivr.net/gh/mxi-git-repo/modular-cube/main.js"
                }
            }
        </script>
        <!-- 
            Import the initialization script. 
            This ensures that application configuration and components are loaded and registered when the project starts. 
        -->
        <script type="module" src="./init.js"></script>
    </head>
    <body>
        <!-- 
            Application content is placed here. 
            The root component can be declared inside <body> to bootstrap the UI. 
        -->
    </body>
    </html>

`;

export const COMPONENT_CONFIG_FILE = `
    {
        "name": "my-component",   ➝ # Name of the component tag.
        "descripttion": "",       ➝ # Optional description for documentation or metadata.
        "files": {
            "html": {
                "path": ""        ➝ # Path to the component’s HTML template.
            },
            "css": {
                "path": ""        ➝ # Path to the CSS styles for the component.
            }
        },
        "behavior": {
            "apendToBody": false, ➝ # Indicates whether the component should be appended to the body tag automatically at load time.
            "lazyLoading": false, ➝ # Enables deferred loading of components until they are needed.
            "debug": false        ➝ # Enables debug mode for logging and diagnostics.
        }
    }

`;

export const COMPONENT_CONFIG = `
    {
        "name": "my-component",  
        "descripttion": "",      
        "files": {
            "html": {
                "path": ""       
            },
            "css": {
                "path": ""       
            }
        },
        "behavior": {
            "apendToBody": false,
            "lazyLoading": false,
            "debug": false       
        }
    }

`;

export const COMPONENT_STYLE_FILE = `
    /* Styles applied to the component’s host element (Shadow DOM root) */
    :host {
        display: flex;              /* Use flexbox for layout */
        flex-direction: column;     /* Arrange child elements vertically */
        width: 100%;                /* Expand to full width of parent */
        height: 100%;               /* Expand to full height of parent */
        gap: 0.5rem;
    }

    /* Example of a styled internal container */
    .container {
        border: 1px solid #ccc;             
        padding: 1rem;
    }

    /* Example of a header element */
    .header {
        font-size: 1.25rem;       
        font-weight: bold;      
    }

    /* Example of a content section */
    .content {
        flex: 1;                    
        line-height: 1.5;           
    }

    /* Example of a footer element */
    .footer {
        font-size: 0.875rem; 
        color: #666;  
    }

`;

export const COMPONENT_STYLE = `
    /* Styling for UI Components */
    :host {
        width: 100%;
        height: 100%;
    }

`;

export const COMPONENT_TEMPLATE = `
    <!-- Root component template -->
    <div class="container">
        
        <!-- Header section -->
        <div class="header">
            Component Header
        </div>

        <!-- Main content area -->
        <div class="content">
            <p>
                This is an example content block inside the component.  
                It can contain text, links, or other nested elements.
            </p>
        </div>

        <!-- Footer section -->
        <div class="footer">
            Footer information or actions
        </div>
    </div>

`;

export const COMPONENT_LOGIC = `
    import { HTMLComponent } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    // Define a new component by extending the base HTMLComponent class
    export default class MyComponent extends HTMLComponent {

        // Called before the component is fully processed
        // Typically used to load configuration (HTML, CSS, behavior settings, etc.)
        preProcess() {
            super.preProcess({ config });
        }

        // Called early in the component lifecycle
        // Can be used to set up initial properties or prepare internal state
        toProcess() { 
            // Add early setup logic here
        }

        // Called asynchronously during processing
        // Suitable for tasks like fetching data or performing async operations
        async atProcess() { 
            // Add async logic here
        }

        // Called after the component’s DOM has been created
        // Provides access to the shadow DOM for manipulation or event binding
        inProcess(dom) {
            // Example: dom.querySelector('.button').addEventListener('click', ...)
        }
    }

`;

export const VARIABLE_INTERPOLATION_LOGIC = `
    import { HTMLComponent } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    export default class MyComponent extends HTMLComponent {
        word = "world";
        title = "Variable Interpolation";
        color = "red";

        preProcess() {
            super.preProcess({ config });
        }

        atProcess(dom) { }

        inProcess(dom) { }
    }

`;

export const VARIABLE_INTERPOLATION_TEMPLATE = `
    <!-- Text content interpolation -->
    <p>Hello, \${this.word}!</p>

    <!-- Attribute binding -->
    <img alt="\${this.title}">

    <!-- Conditional class binding -->
    <div class="card-\${this.color}">...</div>

    <!-- Inline style binding -->
    <span style="color: '\${this.color}';">Colored Text</span>

`;

export const VARIABLE_INTERPOLATION_RESULT = `
    <p>Hello, world!</p>

    <img title="Variable Interpolation">

    <div class="card-red">...</div>

    <span style="color: 'red'">Colored Text</span>

`;

export const VARIABLE_INJECTION_LOGIC = `
    import { HTMLComponent } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    export default class MyComponent extends HTMLComponent {
        paramValue = "Example Value";

        preProcess() {
            super.preProcess({ config });
        }

        atProcess(dom) { }

        inProcess(dom) { }
    }

`;

export const VARIABLE_INJECTION_TEMPLATE = `
    <div>
        <param value="\${this.paramValue}">
    </div>

`;

export const VARIABLE_INJECTION_RESULT = `
    <div>
        Example Value
    </div>

`;

export const CONDITIONAL_LOGIC = `
    import { HTMLComponent } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    export default class MyComponent extends HTMLComponent {
        isValid = true;
        isNotValid = false;
        color = "blue";

        preProcess() {
            super.preProcess({ config });
        }

        atProcess(dom) { }

        inProcess(dom) { }
    }

`;

export const CONDITIONAL_TEMPLATE = `
    <!-- Example 01 – Multiple Independent *if Conditions (No Fallback) -->
    <div id="example_01">
        <!-- Rendered if color is "blue" -->
        <div if="\${this.color === 'blue'}">test1</div>

        <!-- Rendered if color is "red" -->
        <div if="\${this.color === 'red'}">test2</div>

        <!-- Rendered if color is "yellow" -->
        <div if="\${this.color === 'yellow'}">test3</div>
    </div>

    <!-- Example 02 – Nested Independent *if Blocks -->
    <div id="example_02">
        <!-- Outer condition: only evaluated if color is "blue" -->
        <div if="\${this.color === 'blue'}">
            <!-- Rendered if color is "blue" AND isValid is true -->
            <div if="\${this.isValid}">test4</div>

            <!-- Rendered if color is "blue" AND isNotValid is true -->
            <!-- These are independent checks — both can render if true -->
            <div if="\${this.isNotValid}">test5</div>
        </div>
    </div>

`;

export const CONDITIONAL_RESULT = `
    <div id="example_01">
        <div>test1</div>
    </div>

    <div id="example_02">
        <div>
            <div>test4</div>
        </div>
    </div>

`;

export const COMPONENT_IF_ELSE_LOGIC = `
    import { HTMLComponent } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    export default class MyComponent extends HTMLComponent {
        isValid = true;
        isNotValid = false;
        color = "blue";

        preProcess() {
            super.preProcess({ config });
        }

        atProcess(dom) { }

        inProcess(dom) { }
    }

`;

export const COMPONENT_IF_ELSE_TEMPLATE = `
    <!-- Example 03 – Multiple *if conditions with a final *else -->
    <div id="example_03">
        <!-- Rendered if color is "blue" -->
        <div if="\${this.color === 'blue'}">test1</div>

        <!-- Rendered if color is "red" and previous condition was false -->
        <div if="\${this.color === 'red'}">test2</div>

        <!-- Rendered if color is "yellow" and previous conditions were false -->
        <div if="\${this.color === 'yellow'}">test3</div>
        <!-- Rendered only if none of the above conditions match -->
        <div else>test4</div>
    </div>

    <!-- Example 04 – Nested *if blocks -->
    <div id="example_04">
        <!-- Outer condition: rendered only if color is "blue" -->
        <div if="\${this.color === 'blue'}">
            <!-- Rendered if color is "blue" AND isValid is true -->
            <div if="\${this.isValid}">test5</div>

            <!-- Rendered if color is "blue" AND isNotValid is true -->
            <!-- Note: these are separate sibling conditions and are not mutually exclusive -->
            <div if="\${this.isNotValid}">test6</div>
        </div>
        <!-- Rendered only if color is NOT "blue" -->
        <div else>test7</div>
    </div>

`;

export const COMPONENT_IF_ELSE_RESULT = `
    <div id="example_03">
        <div>test1</div>
        <div>test4</div>
    </div>

    <div id="example_04">
        <div>
            <div>test5</div>
        </div>
    </div>
    
`;

export const COMPONENT_IF_ELSEIF_ELSE_LOGIC = `
    import { HTMLComponent } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    export default class MyComponent extends HTMLComponent {
        isValid = true;
        isNotValid = false;
        color = "blue";

        preProcess() {
            super.preProcess({ config });
        }

        atProcess(dom) { }

        inProcess(dom) { }
    }
    
`;

export const COMPONENT_IF_ELSEIF_ELSE_TEMPLATE = `
    <!-- Example 05 – Full *if → *elseIf → *else Chain -->
    <div id="example_05">
        <!-- Rendered if color is "purple" -->
        <div if="\${this.color === 'purple'}">test1</div>
        <!-- Rendered if the previous condition was false AND color is "red" -->
        <div elseIf="\${this.color === 'red'}">test2</div>
        <!-- Rendered if previous conditions were false AND color is "blue" -->
        <div elseIf="\${this.color === 'blue'}">test3</div>
        <!-- Rendered only if none of the above conditions match -->
        <div else>test4</div>
    </div>
    
`;

export const COMPONENT_IF_ELSEIF_ELSE_RESULT = `
    <div id="example_05">
        <div>test3</div>
    </div>

`;

export const COMPONENT_FOR_LOGIC = `
    import { HTMLComponent } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    export default class MyComponent extends HTMLComponent {
        items = [1, 2, 3];

        preProcess() {
            super.preProcess({ config });
        }

        atProcess(dom) { }

        inProcess(dom) { }
    }
    
`;

export const COMPONENT_FOR_TEMPLATE = `
    <div \${this.forExpression}>
        <div id="\${this.forExpressionItem}">
            item: <param value="\${this.forExpressionItem}">
        </div>
    </div>
    
`;

export const COMPONENT_FOR_RESULT = `
    <div>
        <div id="1"> item: 1 </div>
        <div id="2"> item: 2 </div>
        <div id="3"> item: 3 </div>
    </div>

`;

export const COMPONENT_EVENT_LOGIC = `
    import { HTMLComponent } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    export default class MyComponent extends HTMLComponent {
        total = 0;

        preProcess() {
            super.preProcess({ config });
        }

        atProcess(dom) { }

        inProcess(dom) { }

        addNumber(value) {
            this.total += value;
            console.log(this.total);
        }

        subtractNumber(value) {
            this.total -= value;
            console.log(this.total);
        }

        reset() {
            this.total = 0;
            console.log(this.total);
        }
    }
    
`;

export const COMPONENT_EVENT_TEMPLATE = `
    <div clickEvent="addNumber(5)"></div>
    <div clickEvent="subtractNumber(3)"></div>
    <div resizeEvent="reset()"></div>
    
`;

export const COMPONENT_EVENT_RESULT = `
    5
    2
    0

`;

export const CSS_INTERPOLATION_LOGIC = `
    import { HTMLComponent } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    export default class MyComponent extends HTMLComponent {
        borderRadius = "8px";
        cardBackground = "#fafafa"

        preProcess() {
            super.preProcess({ config });
        }

        atProcess(dom) { }

        inProcess(dom) { }
    }
    
`;

export const EMPTY_TEMPLATE = `
    <!-- Document Content -->
    
`;

export const CSS_INTERPOLATION_STYLE = `
    :host {
        --component-radius: \${this.borderRadius};
    }

    .card {
        border: 1px solid #ccc;
        border-radius: var(--component-radius);
        padding: 1rem;
        background: \${this.cardBackground};
    }
    
`;

export const CSS_INTERPOLATION_RESULT = `
    :host {
        --component-radius: 8px;
    }

    .card {
        border: 1px solid #ccc;
        border-radius: var(--component-radius);
        padding: 1rem;
        background: #fafafa;
    }

`;

export const OBSERVABLE_LOGIC = `
    import { HTMLComponent, Observable } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    class MyComponent extends HTMLElement {
        preProcess() {
            super.preProcess({ config });
        }

        atProcess(dom) { 
            const user = { 
                "user": {
                    "id": "123456789",
                    "name": "Joe Test",
                    "email": "joe.test@example.com",
                    "role": "admin",
                    "createdAt": "2025-07-24T10:00:00Z"
                }, 
                token: "12345abcdeTOKENxyz789" 
            };
            observable.publish('user-logged-in', user);
        }

        inProcess(dom) { }
    }
    
`;

export const OBSERVABLE_SUBSCRIBE_LOGIC = `
    import { HTMLComponent, Observable } from '@modular-cube';
    import config from './MyComponent.config.json' with { type: "json" };

    class MyComponent extends HTMLElement {
        preProcess() {
            super.preProcess({ config });
        }

        atProcess(dom) { 
            observable.subscribe('user-logged-in', (user) => {
                console.log(user); 
                /* console output: 
                    {
                        "user": {
                            "id": "123456789",
                            "name": "Joe Test",
                            "email": "joe.test@example.com",
                            "role": "admin",
                            "createdAt": "2025-07-24T10:00:00Z"
                        }, 
                        token: "12345abcdeTOKENxyz789"
                    }
                */
            });
        }

        inProcess(dom) { }
    }
    
`;