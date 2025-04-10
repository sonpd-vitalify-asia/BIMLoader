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
                                [139.68916027204043, 35.688425210208294],
                                [139.68744520486524, 35.69091967281949],
                                [139.69018015208286, 35.69183733597276],
                                [139.69091560185112, 35.688655450216125],
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

