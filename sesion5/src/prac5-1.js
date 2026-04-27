    import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
    import * as dashjs from 'dashjs';
    import * as THREE from 'three';

    if ( WEBGL.isWebGL2Available() ) {
        // WebGL is available
        console.log("WebGL 2 is available.");

        const url = "http://localhost:60080/trailer.mpd";
        const video = document.querySelector("#player");
        video.style.display = "block";

        //Para el botón de inicio
        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', () => init(), false);

        function init() {
            var overlay = document.getElementById('overlay');
            overlay.remove();

            // Do stuff
            const player = dashjs.MediaPlayer().create();
            player.initialize(video, url, true);
        }
    }
