import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as WEBIFC from "web-ifc";

export function setupBIMLoader(map) {

    let classifier;
    let color = new THREE.Color();
    let slabs;
    let walls;
    let curtainWalls;
    let furniture;
    let doors;
    let all;

    let defaultWallColorCode = "#ebd6e7";
    let defaultSlabsColorCode = "#ade1e5";

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
                    //enableSelectingFeatures: true,
                    //enableSelectingObjects: true,
                    //enableDraggingObjects: true,
                    //enableRotatingObjects: true,
                    //enableTooltips: true
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
        classifier = components.get(OBC.Classifier);

        await fragmentIfcLoader.setup();

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

            classifier.byEntity(model);

            slabs = classifier.find({
                entities: ["IFCSLAB"],
            });

            walls = classifier.find({
                entities: ["IFCWALLSTANDARDCASE"],
            });

            curtainWalls = classifier.find({
                entities: ["IFCMEMBER", "IFCPLATE"],
            });

            furniture = classifier.find({
                entities: ["IFCFURNISHINGELEMENT"],
            });

            doors = classifier.find({
                entities: ["IFCDOOR"],
            });

            all = classifier.find({
                models: [model.uuid],
            });

            classifier.setColor(walls, new THREE.Color(defaultWallColorCode));
            classifier.setColor(slabs, new THREE.Color(defaultSlabsColorCode));

            LoadUI();
        }

        //fragments.onFragmentsLoaded.add((model) => {
        //    console.log(model);
        //});
    }

    function LoadUI() {
        BUI.Manager.init();

        const panel = BUI.Component.create(() => {
            return BUI.html`
    <bim-panel active label="Set Color" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-color-input 
          label="Walls Color" color="#ebd6e7" id="wcolorbutton"
          @input="${({ target }) => {
                    color.set(target.color)
                    classifier.setColor(walls, color)
                }}">
        </bim-color-input>
      
        <bim-color-input 
          label="Slabs Color" color="#ade1e5" id="slabcolorbutton"
          @input="${({ target }) => {
                    color.set(target.color)
                    classifier.setColor(slabs, color)
                }}">
        </bim-color-input>

        <bim-button 
          label="Reset walls color" 
          @click="${() => {
                document.getElementById("wcolorbutton").color = defaultWallColorCode;
                document.getElementById("slabcolorbutton").color = defaultSlabsColorCode;
                classifier.setColor(walls, new THREE.Color(defaultWallColorCode));
                classifier.setColor(slabs, new THREE.Color(defaultSlabsColorCode));
                }}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `
        })

        document.body.append(panel);
    }

}

