
export function setupBuilding(map) {

    // add a geojson source which specifies the custom model to be used by the model layer.
    map.addSource('model', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {
                'model-uri':
                    'http://localhost:5173/BIMLoader/tower.glb'
            },
            'geometry': {
                'coordinates': origin,
                'type': 'Point'
            }
        }
    });


    // add the model layer and specify the appropriate `slot` to ensure the symbols are rendered correctly.
    map.addLayer({
        'id': 'tower',
        'type': 'model',
        'slot': 'middle',
        'source': 'model',
        'minzoom': 15,
        'layout': {
            'model-id': ['get', 'model-uri']
        },
        'paint': {
            'model-opacity': 1,
            'model-rotation': [0.0, 0.0, 35.0],
            'model-scale': [0.8, 0.8, 1.2],
            'model-color-mix-intensity': 0,
            'model-cast-shadows': true,
            'model-emissive-strength': 0.8,
        }
    });

    //map.addSource('model2', {
    //    'type': 'geojson',
    //    'data': {
    //        'type': 'Feature',
    //        'properties': {
    //            'model-uri':
    //                'http://localhost:5173/BIMLoader/tower.glb'
    //        },
    //        'geometry': {
    //            'coordinates': [139.66461146239243, 35.708],
    //            'type': 'Point'
    //        }
    //    }
    //});

    //map.addLayer({
    //    'id': 'building1',
    //    'type': 'model',
    //    'slot': 'middle',
    //    'source': 'model2',
    //    'minzoom': 15,
    //    'layout': {
    //        'model-id': ['get', 'model-uri']
    //    },
    //    'paint': {
    //        'model-opacity': 1,
    //        'model-rotation': [0.0, 0.0, 35.0],
    //        'model-scale': [0.8, 0.8, 1.2],
    //        'model-color-mix-intensity': 0,
    //        'model-cast-shadows': true,
    //        'model-emissive-strength': 0.8,
    //    }
    //});

    map.setLights([{
        "id": "directional",
        "type": "directional",
        "properties": {
            "color": "rgba(255.0, 255.0, 255.0, 1.0)",
            "intensity": 1,
            "direction": [210.0, 80],
            "cast-shadows": true,
            "shadow-intensity": 1
        }
    }]);
}
