
export function setupShadow(map) {

    let origin = [139.6902, 35.689];

    let styles = {
        day: 'ckomjiv0e0bka17mzt5z7v5ij',
        night: 'cma6doztc00dn01sl7wrl5zol'
    }
    let selectedStyle = styles.day;

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

        let date = tb.lightDateTime;
        let time = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds());
        let timeInput = document.getElementById('time');
        timeInput.value = time;
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
            let sunTimes = tb.getSunTimes(date, origin);
            if (date >= sunTimes.sunriseEnd && date <= sunTimes.sunsetStart) {
                if (selectedStyle != styles.day) {
                    console.log("it's day");
                    map.setPaintProperty('background', 'background-color', '#7fb4f7');
                    selectedStyle = styles.day;

                    map.dirLight.visible = true;
                }
            } else {
                if (selectedStyle != styles.night) {
                    console.log("it's night");
                    map.setPaintProperty('background', 'background-color', '#808080');
                    selectedStyle = styles.night;

                    map.dirLight.visible = false;
                }
            }
        }
    }
}
