export function setupLoader(map) {

    var THREE = window.THREE;

    // parameters to ensure the model is georeferenced correctly on the map
    var modelOrigin = [139.66461146239243, 35.70698328883841]; 
    var modelAltitude = 0;
    var modelRotate = [Math.PI / 2, THREE.MathUtils.degToRad(2), 0];

    var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
    );

    let dirLight;

    // transformation parameters to position, rotate and scale the 3D model onto the map
    var modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        /* Since our 3D model is in real world meters, a scale transform needs to be
         * applied since the CustomLayerInterface expects units in MercatorCoordinates.
         */
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

    map.addLayer({
        id: 'building-layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, gl) {
            this.camera = new THREE.Camera();
            this.scene = new THREE.Scene();

            dirLight = new THREE.DirectionalLight(0x5a5a5a, 1);
            dirLight.position.set(40, 170, 200);
            let d = 1000;
            let r = 2;
            let mapSize = 8096;
            dirLight.castShadow = true;
            dirLight.shadow.radius = r;
            dirLight.shadow.mapSize.width = mapSize;
            dirLight.shadow.mapSize.height = mapSize;
            dirLight.shadow.camera.top = dirLight.shadow.camera.right = d;
            dirLight.shadow.camera.bottom = dirLight.shadow.camera.left = -d;
            dirLight.shadow.camera.near = 50;
            dirLight.shadow.camera.far = 1000;
            dirLight.intensity = 6;
            dirLight.shadow.bias = 0.0001;
            //dirLight.shadow.camera.visible = true;
            this.scene.add(dirLight);
            map.dirLight = dirLight;

            var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
            this.scene.add(hemiLight);

            // use the three.js GLTF loader to add the 3D model to the three.js scene
            var loader = new THREE.GLTFLoader();
            loader.load(
                './scene.glb',
                function (gltf) {
                    gltf.scene.traverse(function (model) {
                        if (model.isMesh) {
                            model.castShadow = true;
                            model.receiveShadow = true;
                        }

                    });
                    this.scene.add(gltf.scene);
                    // we add the shadow plane automatically 
                    const s = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3(0, 0, 0));
                    const sizes = [s.x, s.y, s.z];
                    const planeSize = Math.max(...sizes) * 10;
                    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
                    //const planeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide});
                    const planeMat = new THREE.ShadowMaterial();
                    planeMat.opacity = 0.5;
                    let plane = new THREE.Mesh(planeGeo, planeMat);
                    plane.rotateX(-Math.PI / 2);
                    //plane.layers.enable(1); plane.layers.disable(0); // it makes the object invisible for the raycaster
                    plane.receiveShadow = true;
                    this.scene.add(plane);

                    const house_geometry_1 = new THREE.BoxGeometry(30, 30, 70);
                    const house_material_1 = new THREE.ShadowMaterial({
                        color: 0x595959,
                        opacity: 1,
                    });

                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x595959,
                        opacity: 0.5,
                        transparent : true,
                    });
                    const house1 = new THREE.Mesh(house_geometry_1, house_material_1);
                    house1.receiveShadow = true;
                    house1.position.set(-80,15,-25);
                    this.scene.add(house1);


                    const house_geometry_2 = new THREE.BoxGeometry(30, 30, 30);
                    const house_material_2 = new THREE.ShadowMaterial({
                        color: 0x595959,
                        opacity: 1,
                    });
                    const mat2 = new THREE.MeshStandardMaterial({
                        color: 0x595959,
                        opacity: 0.5,
                        transparent: true,
                    });
                    const house2 = new THREE.Mesh(house_geometry_2, house_material_2);
                    house2.receiveShadow = true;
                    house2.position.set(-57, 15, -42);
                    this.scene.add(house2);


                    const house_geometry_3 = new THREE.BoxGeometry(30, 30, 30);
                    const house_material_3 = new THREE.ShadowMaterial({
                        color: 0x595959,
                        opacity: 1,
                    });
                    const mat3 = new THREE.MeshStandardMaterial({
                        color: 0x595959,
                        opacity: 0.5,
                        transparent: true,
                    });
                    const house3 = new THREE.Mesh(house_geometry_3, house_material_3);
                    house3.receiveShadow = true;
                    house3.position.set(-65, 15, -71);
                    this.scene.add(house3);

                    const house_geometry_4 = new THREE.BoxGeometry(30, 30, 300);
                    const house_material_4 = new THREE.ShadowMaterial({
                        color: 0x595959,
                        opacity: 1,
                    });
                    const mat4 = new THREE.MeshStandardMaterial({
                        color: 0x595959,
                        opacity: 0.5,
                        transparent: true,
                    });
                    const house4 = new THREE.Mesh(house_geometry_4, house_material_4);
                    house4.receiveShadow = true;
                    house4.position.set(80, 15, 0);
                    this.scene.add(house4);

                }.bind(this)
            );
            this.map = map;

            // use the Mapbox GL JS map canvas for three.js
            this.renderer = new THREE.WebGLRenderer({
                canvas: map.getCanvas(),
                context: gl,
                antialias: true
            });

            this.renderer.autoClear = false;
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        },
        render: function (gl, matrix) {
            var rotationX = new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(1, 0, 0),
                modelTransform.rotateX
            );
            var rotationY = new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(0, 1, 0),
                modelTransform.rotateY
            );
            var rotationZ = new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(0, 0, 1),
                modelTransform.rotateZ
            );

            var m = new THREE.Matrix4().fromArray(matrix);
            var l = new THREE.Matrix4()
                .makeTranslation(
                    modelTransform.translateX,
                    modelTransform.translateY,
                    modelTransform.translateZ
                )
                .scale(
                    new THREE.Vector3(
                        modelTransform.scale,
                        -modelTransform.scale,
                        modelTransform.scale
                    )
                )
                .multiply(rotationX)
                .multiply(rotationY)
                .multiply(rotationZ);

            this.camera.projectionMatrix = m.multiply(l);
            this.renderer.state.reset();
            this.renderer.render(this.scene, this.camera);

            this.map.triggerRepaint();

            const radius = 155;

            if (window.tb.sunPosition != undefined) {
                dirLight.position.x = radius * Math.sin(window.tb.sunPosition.azimuth);
                dirLight.position.z = radius * Math.cos(window.tb.sunPosition.azimuth);
            }
        },
    });
}