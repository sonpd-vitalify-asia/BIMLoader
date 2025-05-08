import { setupPlateau } from './map-visualizer.js';
import { setupLoader } from './map-loader.js';
import { setupShadow } from './shadow-loader.js';
import { setupBuilding } from './building-loader.js';

const VITE_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = VITE_MAPBOX_TOKEN;

var origin = [139.66461146239243, 35.70698328883841];
const map = new mapboxgl.Map({
    container: 'map',
    center: origin,
    zoom: 15.27,
    pitch: 42,
    bearing: -50,
    style: 'mapbox://styles/vfasonpd/ckomjiv0e0bka17mzt5z7v5ij',
    minZoom: 15,
    maxZoom: 18
});

map.on('style.load', () => {
    setupPlateau(map);
    // set the light preset to be in dusk mode.
    map.setConfigProperty('basemap', 'lightPreset', 'dusk');


    // add a geojson source which specifies the custom model to be used by the model layer.
    // local:   'http://localhost:5173/BIMLoader/tower.glb'
    map.addSource('model', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {
                'model-uri':
                'https://sonpd-vitalify-asia.github.io/BIMLoader/tower.glb'
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
            'model-rotation': [0.0, 0.0, 0.0],
            'model-scale': [1, 1,  1.5],
            'model-color-mix-intensity': 0,
            'model-cast-shadows': true,
            'model-emissive-strength': 0.8,
        }
    });

    const extrusionGeoJSON = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {
                    height: 15  // meters
                },
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [139.66444844801015, 35.70729972742914], 
                        [139.66497690707288, 35.70729609087284], 
                        [139.66493212240653, 35.70808158318436], 
                        [139.66439918487717, 35.70809249274527], 
                    ]]
                }
            }
        ]
    };

    map.addSource('custom-extrusion', {
        type: 'geojson',
        data: extrusionGeoJSON
    });

    // Add 3D extrusion layer
    map.addLayer({
        id: 'custom-extrusion-layer',
        type: 'fill-extrusion',
        source: 'custom-extrusion',
        paint: {
            'fill-extrusion-color': '#ffffff',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 1
        }
    });

    setupShadow(map);
});