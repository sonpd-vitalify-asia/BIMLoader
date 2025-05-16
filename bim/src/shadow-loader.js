
export function setupShadow(map) {

    let origin = [139.6902, 35.689];

    let styles = {
        day: 'day',
        night: 'night',
        zero: 'zero'
    }
    let selectedStyle = styles.zero;
    let cast_shadow = false;
    let date;
    let initialTimeValue;
    let timeInput;
    let interval = null;

    InitButtons();

    map.addLayer({
        id: 'flight-route-layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, mbxContext) {
            window.tb = new Threebox(
                map,
                mbxContext,
                {
                    realSunlight: true
                }
            );

            Load();

        },

        render: function (gl, matrix) {
            tb.update();
        }
    });

    async function Load() {

        date = tb.lightDateTime;
        console.log(date);

        date.setHours(4, 0, 0,0);

        let time = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds());
        timeInput = document.getElementById('time');
        timeInput.value = time;
        initialTimeValue = time;

        changeStyleWithDaylight(date, origin);

        timeInput.oninput = () => {
            time = +timeInput.value;
            date.setHours(Math.floor(time / 3600));
            date.setMinutes(Math.floor(time / 60) % 60);
            date.setSeconds(time % 60);

            map.triggerRepaint();
        };

        function dateToTimezone(date = new Date(), timezone) {
            let tzTime = date.toLocaleString("en-US", { timeZone: timezone });
            return new Date(tzTime);
        }

        map.on('render', () => {
            tb.setSunlight(date);
            let dateTZ = dateToTimezone(date, 'Asia/Tokyo');
            hour.innerHTML = "Sunlight on date/time: " + date.toLocaleString();
            changeStyleWithDaylight(date, origin);
            map.sunPosition = tb.sunPosition;
        })

        function changeStyleWithDaylight(date, origin) {

            const pos = tb.getSunPosition(date, [-0.12501974, 51.53]);

            function radiansToDegrees(rad) {
                return (rad * 180) / Math.PI;
            }

            const azimuthInDegrees = radiansToDegrees(pos.azimuth); // ≈ 180°

            function normalizeAzimuth(azimuth) {
                return ((azimuth % 360) + 360) % 360;
            }

            let sunTimes = tb.getSunTimes(date, origin);

            if (date >= sunTimes.sunriseEnd && date <= sunTimes.sunsetStart) {
                if (selectedStyle != styles.day || selectedStyle == styles.zero) {
                    console.log("it's day");
                    map.setPaintProperty('background', 'background-color', '#7fb4f7');
                    map.setPaintProperty('building-extrusion', 'fill-extrusion-color', '#ffffff');
                    map.setPaintProperty('custom-extrusion-layer', 'fill-extrusion-color', '#ffffff');
                    selectedStyle = styles.day;
                    cast_shadow = true;

                    const groupedLayers = getLayersByGroup(map, "Road network, surface");
                    groupedLayers.forEach(setWhiteColor);

                    function setWhiteColor(item) {
                        if (item.type == "line") {
                            map.setPaintProperty(item.id, 'line-color', '#a5cdfd');
                        }
                        if (item.type == "fill") {
                            map.setPaintProperty(item.id, 'fill-color', '#a5cdfd');
                        }
                    }
                }

            } else {
                if (selectedStyle != styles.night) {
                    console.log("it's night");
                    map.setPaintProperty('background', 'background-color', '#808080');
                    map.setPaintProperty('building-extrusion', 'fill-extrusion-color', '#808080');
                    map.setPaintProperty('custom-extrusion-layer', 'fill-extrusion-color', '#808080');

                    selectedStyle = styles.night;
                    cast_shadow = false;

                    const groupedLayers = getLayersByGroup(map, "Road network, surface");
                    groupedLayers.forEach(setGreyColor);

                    function setGreyColor(item) {
                        if (item.type == "line") {
                            map.setPaintProperty(item.id, 'line-color', '#808080');
                        }
                        if (item.type == "fill") {
                            map.setPaintProperty(item.id, 'fill-color', '#808080');
                        }
                    }
                }

            }

            map.setLights([{
                "id": "directional",
                "type": "directional",
                "properties": {
                    "color": "rgba(255.0, 255.0, 255.0, 1.0)",
                    "intensity": 1,
                    "direction": [normalizeAzimuth(azimuthInDegrees), 60],
                    "cast-shadows": cast_shadow,
                    "shadow-intensity": 0.5
                }
            }]);
        }
    }

    function InitButtons() {
        const playBtn = document.getElementById('playButton');
        const pauseBtn = document.getElementById('pauseButton');
        pauseBtn.classList.add('active');
        playBtn.style.display = 'inline';
        pauseBtn.style.display = 'none';

        playBtn.addEventListener('click', () => {

            playBtn.classList.add('active');
            pauseBtn.classList.remove('active');

            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline';

            if (interval == undefined) {

                interval = setInterval(() => {
                    var val = parseInt(timeInput.value) + 250; // Change this line+ 1;

                    timeInput.value = val;

                    timeInput.dispatchEvent(new Event('input'));

                }, 100); // advance every 0.1 seconds
            }
        });

        pauseBtn.addEventListener('click', () => {
            pauseBtn.classList.add('active');
            playBtn.classList.remove('active');

            playBtn.style.display = 'inline';
            pauseBtn.style.display = 'none';

            if (interval != undefined) {
                clearInterval(interval);
                // release our intervalId from the variable
                interval = null;
            }
        });

        document.getElementById('resetButton').addEventListener('click', () => {

            timeInput.value = initialTimeValue;

            timeInput.dispatchEvent(new Event('input'));
        });
    }

    function getLayersByGroup(map, groupId) {
        const layers = map.getStyle().layers;
        return layers.filter(layer =>
            layer.metadata && layer.metadata["mapbox:group"] === groupId
        );
    }
}
