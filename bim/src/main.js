import { setupPlateau } from './map-visualizer.js';

const VITE_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = VITE_MAPBOX_TOKEN;

const origin = [139.68943629377733, 35.69018018477205];
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: origin,
    zoom: 15.27,
    pitch: 42,
    bearing: -50,
    style: 'mapbox://styles/vfasonpd/ckomjiv0e0bka17mzt5z7v5ij',
    minZoom: 7,
    maxZoom: 20,
    maxPitch: 80,
});

map.on('style.load', function () {
    setupPlateau(map);
});
