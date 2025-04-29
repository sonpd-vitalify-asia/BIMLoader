export function setupLoader(map) {

    var THREE = window.THREE;

    // parameters to ensure the model is georeferenced correctly on the map
    var modelOrigin = [139.6900245027105, 35.68854705256683];
    var modelAltitude = 0;
    var modelRotate = [Math.PI / 2, THREE.MathUtils.degToRad(10), 0];

    var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
    );

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
        id: 'flight-route-layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, gl) {
            this.camera = new THREE.Camera();
            this.scene = new THREE.Scene();

            const dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.position.set(40, 70, 100);
            let d = 1000;
            let r = 2;
            let mapSize = 8096;
            dirLight.castShadow = true;
            dirLight.shadow.radius = r;
            dirLight.shadow.mapSize.width = mapSize;
            dirLight.shadow.mapSize.height = mapSize;
            dirLight.shadow.camera.top = dirLight.shadow.camera.right = d;
            dirLight.shadow.camera.bottom = dirLight.shadow.camera.left = -d;
            dirLight.shadow.camera.near = 1;
            dirLight.shadow.camera.far = 1000;
            dirLight.intensity = 6;
            dirLight.shadow.bias = 0.0001;
            //dirLight.shadow.camera.visible = true;

            this.scene.add(dirLight);
            this.scene.add(new THREE.DirectionalLightHelper(dirLight, 10));


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
        },
    });
}