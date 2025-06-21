import { useEffect, useRef, useState } from 'react';
import { Layout, Model, TabNode, IJsonModel, TabSetNode, BorderNode, ITabSetRenderValues, Actions, DockLocation, AddIcon } from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import './App.css';

const json: IJsonModel = {
    global: { 
        "tabEnablePopout": true,
        "splitterEnableHandle": true,
		"tabSetMinWidth": 130,
		"tabSetMinHeight": 100,
		"borderMinSize": 100,
		"tabSetEnableTabScrollbar": true,
		"borderEnableTabScrollbar": true
    },
    borders: [
        {
            "type": "border",
            "location": "bottom",
            "children": [
                {
                    "type": "tab",
                    "name": "JSON",
                    "component": "json",
                    "enableClose": false,
                },
            ]
        },
    ],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "One",
                        component: "placeholder",
                    }
                ]
            },
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "Two",
                        component: "placeholder",
                    }
                ]
            }
        ]
    }
};

const model = Model.fromJson(json);

function App() {
    const nextAddIndex = useRef<number>(1);

    const factory = (node: TabNode) => {
        const component = node.getComponent();
        switch (component) {
            case "placeholder":
                return <div className="placeholder">{node.getName()}</div>;
            case "json":
                return <ModelJson model={model}/>;
            default:
                return <div>{"unknown component " + component}</div>
        }
    }

    const onRenderTabSet = (node: TabSetNode | BorderNode, renderValues: ITabSetRenderValues) => {
        if (node instanceof TabSetNode) {
            renderValues.stickyButtons.push(
                <button
                    key="Add"
                    title="Add"
                    className="flexlayout__tab_toolbar_button"
                    onClick={() => {
                        model.doAction(Actions.addNode({
                            component: "placeholder",
                            name: "Added " + nextAddIndex.current++
                        }, node.getId(), DockLocation.CENTER, -1, true));
                    }}
                ><AddIcon/></button>);
        }
    }

    return (
        <Layout
            model={model}
            factory={factory}
            onRenderTabSet={onRenderTabSet}
            realtimeResize={true}
        />
    );
}

// component to show the current model json
function ModelJson({model}:{model: Model}) {
    const [json, setJson] = useState<string>(JSON.stringify(model.toJson(), null, "\t"));
    const timerRef = useRef<number>(0);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setJson(JSON.stringify(model.toJson(), null, "\t"));
        }, 500);
        return () => { clearInterval(timerRef.current)}
    }, []);

    return (
        <pre>{json}</pre>
    );
}

export default App;
