import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as WEBIFC from "web-ifc";

const container = document.getElementById("container");

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
 
const world = worlds.create(
    OBC.SimpleScene,
    OBC.SimpleCamera,
    OBC.SimpleRenderer
);

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

//const material = new THREE.MeshLambertMaterial({ color: "#00b2ff" });
//const geometry = new THREE.BoxGeometry();
//const cube = new THREE.Mesh(geometry, material);
//world.scene.three.add(cube);

world.scene.setup();

world.camera.controls.setLookAt(60, 20, 50, 0, 0, 0);

const grids = components.get(OBC.Grids);
grids.create(world);

const fragments = components.get(OBC.FragmentsManager);
const fragmentIfcLoader = components.get(OBC.IfcLoader);

await fragmentIfcLoader.setup();

const excludedCats = [
    WEBIFC.IFCTENDONANCHOR,
    WEBIFC.IFCREINFORCINGBAR,
    WEBIFC.IFCREINFORCINGELEMENT,
];

for (const cat of excludedCats) {
    fragmentIfcLoader.settings.excludedCategories.add(cat);
}

fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

loadIfc();

async function loadIfc() {
    const file = await fetch(
        "./LargeBuilding.ifc",
    );
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer);
    model.name = "example";
    world.scene.three.add(model); 
}

fragments.onFragmentsLoaded.add((model) => {
    console.log(model);
});

