    import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
   import * as dashjs from 'dashjs';
    import * as THREE from 'three';

    if ( WEBGL.isWebGL2Available() ) {
        // WebGL is available
        console.log("WebGL 2 is available.");

        const video = document.getElementById( 'player' );

        const url = "http://localhost:60080/trailer.mpd";
        const player = dashjs.MediaPlayer().create();
        player.initialize(document.querySelector("#player"), url, true);

        const image = document.createElement( 'canvas' );
        image.width = 480;  // Video width
        image.height = 204; // Video height
        const imageContext = image.getContext( '2d' );
        imageContext.fillStyle = '#000000';
        imageContext.fillRect( 0, 0, image.width - 1, image.height - 1 );
        const texture = new THREE.Texture( image );

        //Para el botón de inicio
        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', () => init(), false);

        function init() {
            var overlay = document.getElementById('overlay');
            overlay.remove();

            // Do stuff
            const video = document.getElementById('player');
            video.play();
        }

        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer( {antialias: true} );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
        camera.position.set( 0, 0, 300 );
        
        const material = new THREE.MeshBasicMaterial( { map: texture } );
        const wall = new THREE.PlaneGeometry( image.width, image.height, 4, 4 );
        const plane = new THREE.Mesh( wall, material );

        if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
            imageContext.drawImage( video, 0, 0 );
            if ( texture ) texture.needsUpdate = true;
        }

        scene.add( plane );

        // Animation loop - Actualizar la textura del vídeo continuamente
        function animate() {
            requestAnimationFrame( animate );
            
            // Actualizar el canvas con cada frame del vídeo
            if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
                imageContext.drawImage( video, 0, 0 );
                texture.needsUpdate = true;
            }
            
            //Puse que girara rápido para ver que se hacía bien.
            //plane.rotation.y += 0.015;
            
            renderer.render( scene, camera );
        }
        animate();

        window.addEventListener( 'resize', ( ) => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix( );
            renderer.setSize( window.innerWidth, window.innerHeight );
        }, false );
    }