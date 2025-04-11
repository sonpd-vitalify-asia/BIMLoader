import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as WEBIFC from "web-ifc";

export function setupBIMLoader(map) {

    map.addLayer({
        id: 'flight-route-layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, mbxContext) {
            window.tb = new Threebox(
                map,
                mbxContext,
                {
                    defaultLights: true,
                    enableSelectingFeatures: true,
                    enableSelectingObjects: true,
                    enableDraggingObjects: true,
                    enableRotatingObjects: true,
                    enableTooltips: true
                }
            );

            Load();
        },

        render: function (gl, matrix) {
            tb.update();
        }
    });

    async function Load() {
       
        const container = document.getElementById("map");

        const components = new OBC.Components();

        const fragments = components.get(OBC.FragmentsManager);
        const fragmentIfcLoader = components.get(OBC.IfcLoader);

        await fragmentIfcLoader.setup();

        console.log("++++++");

        fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

        loadIfc();

        async function loadIfc() {
            const file = await fetch(
                "./LargeBuilding.ifc",
            );
            const data = await file.arrayBuffer();
            const buffer = new Uint8Array(data);
            const model = await fragmentIfcLoader.load(buffer);
            model.name = "Large Building";

            var origin = [139.68943629377733, 35.69018018477205];
            var p = tb.projectToWorld(origin);

            model.position.set(p.x, p.y, p.z);
            model.scale.set(0.1, 0.1, 0.1);
            model.rotation.set(Math.PI / 2, 0, 0);
            tb.add(model);

            var threeMaterial = tb.material({
                material: new THREE.MeshStandardMaterial({ color: '#adfc03' }),
            });


        }

        //fragments.onFragmentsLoaded.add((model) => {
        //    console.log(model);
        //});
    }
}

