    import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
    import * as dashjs from 'dashjs';
    import * as THREE from 'three';
    import adapter from 'webrtc-adapter';

    if ( WEBGL.isWebGL2Available() ) {
        // WebGL is available
        console.log("WebGL 2 is available.");

        const video = document.getElementById( 'video' );
        const startButton = document.getElementById('startButton');

        let scene, renderer, camera, plane, texture, imageContext, image;

        startButton.addEventListener('click', () => init(), false);

        function init() {
            // Remove overlay
            var overlay = document.getElementById('overlay');
            overlay.remove();

            // Initialize Three.js scene
            initThreeJS();

            // Capture video from web camera
            const constraints = {
                audio: false,
                video: { width: { exact: 640 }, height: { exact: 480 } }
            };

            navigator.mediaDevices.getUserMedia( constraints )
            // Called when we get the requested streams
            .then( ( stream ) => {

                // Video tracks (usually only one)
                const videoTracks = stream.getVideoTracks( );
                console.log( 'Stream characteristics: ', constraints );
                console.log( 'Using device: ' + videoTracks[0].label );

                // End of stream handler
                stream.onended = () => {
                    console.log( 'End of stream' );
                };

                // Bind the stream to the html video element
                video.srcObject = stream;
                video.play();
            })
            // Called in case of error
            .catch( ( error ) => {

                if ( error.name === 'ConstraintNotSatisfiedError' ) {
                    console.error( 'The resolution ' + constraints.video.width.exact + 'x' +
                                constraints.video.height.exact + ' px is not supported by the camera.' );
                } else if ( error.name === 'PermissionDeniedError' ) {
                    console.error( 'The user has not allowed the access to the camera and the microphone.' );
                }
                console.error( ' Error in getUserMedia: ' + error.name, error );
            });
        }

        function initThreeJS() {
            // Create canvas and texture
            image = document.createElement( 'canvas' );
            image.width = 480;  // Video width
            image.height = 204; // Video height
            imageContext = image.getContext( '2d' );
            imageContext.fillStyle = '#000000';
            imageContext.fillRect( 0, 0, image.width - 1, image.height - 1 );
            texture = new THREE.Texture( image );

            scene = new THREE.Scene();

            renderer = new THREE.WebGLRenderer( {antialias: true} );
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );

            camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
            camera.position.set( 0, 0, 300 );
            
            const material = new THREE.MeshBasicMaterial( { map: texture } );
            const wall = new THREE.PlaneGeometry( image.width, image.height, 4, 4 );
            plane = new THREE.Mesh( wall, material );

            if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
                imageContext.drawImage( video, 0, 0 );
                if ( texture ) texture.needsUpdate = true;
            }

            scene.add( plane );

            // Start animation loop
            animate();
        }

        // Animation loop - Actualizar la textura del vídeo continuamente
        function animate() {
            requestAnimationFrame( animate );
            
            // Actualizar el canvas con cada frame del vídeo
            if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
                imageContext.drawImage( video, 0, 0 );
                texture.needsUpdate = true;
            }
            
            //Puse que girara rápido para ver que se hacía bien.
            plane.rotation.y += 0.05;
            
            renderer.render( scene, camera );
        }

        window.addEventListener( 'resize', ( ) => {
            if ( camera && renderer ) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix( );
                renderer.setSize( window.innerWidth, window.innerHeight );
            }
        }, false );
    }