export function setupPlateau(map) {
    //map.addSource('vector-array-source', {
    //    "type": "vector",
    //    // Replace this URL with a 'mapbox://TILESET_ID'
    //    "tiles": [
    //        "https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf"
    //    ],
    //    "minzoom": 10,
    //    "maxzoom": 16,
    //});

    //map.addLayer({
    //    "id": "bldg",
    //    "type": "fill-extrusion",
    //    "source": "vector-array-source",
    //    "source-layer": "bldg",
    //    "minzoom": 10,
    //    "maxzoom": 20,
    //    "paint": {
    //        "fill-extrusion-color": [
    //            'case',
    //            ['boolean', ['feature-state', 'hover'], false],
    //            "#9e9e9e", "#b0b0b0"
    //        ],
    //        "fill-extrusion-height": ["get", "measuredHeight"]
    //    }
    //});

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
                                [139.6642961383733575597, 35.7082379094738], 
                                [139.66500386564996, 35.708254979006085], 
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

