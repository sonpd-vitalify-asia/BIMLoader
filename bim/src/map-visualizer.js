export function setupPlateau(map) {

    // add a geojson source with a polygon to be used in the clip layer.
    map.addSource('eraser', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'coordinates': [
                            [
                                [139.66434016560476, 35.70734762727297], 
                                [139.66506846307053, 35.707289104885675],
                                [139.66513700246438, 35.70688371493084], 
                                [139.66435569957977, 35.70687233504728], 
                            ]
                        ],
                        'type': 'Polygon'
                    }
                }
            ]
        }
    });

    map.addLayer({
        'id': 'eraser',
        'type': 'clip',
        'source': 'eraser',
        'layout': {
            // specify the layer types to be removed by this clip layer
            'clip-layer-types': ['symbol', 'model'],
            //'clip-layer-scope': ['basemap','bldg']
        }
    });


 }

