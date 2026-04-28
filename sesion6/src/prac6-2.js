    import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
    import * as dashjs from 'dashjs';
    import * as THREE from 'three';
    import adapter from 'webrtc-adapter';

    if ( WEBGL.isWebGL2Available() ) {
        // WebGL is available
        console.log("WebGL 2 is available.");

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
        })
        // Called in case of error
        .catch( ( error ) => {

            if ( error.name === 'ConstraintNotSatisfiedError' ) {

                console.error( 'The resolution ' + constraints.video.width.exact + 'x' +
                            constraints.video.width.exact + ' px is not supported by the camera.' );
            } else if ( error.name === 'PermissionDeniedError' ) {

                console.error( 'The user has not allowed the access to the camera and the microphone.' );
            }
            console.error( ' Error in getUserMedia: ' + error.name, error );
        });

        let streaming = false;
        const width = 320;
        let height = 0;  // Computed based on the width

        video.addEventListener( 'canplay', ( event ) => {

            if ( !streaming ) {  // To prevent re-entry

                height = video.videoHeight / ( video.videoWidth / width );
                video.width = width;
                video.height = height;
                canvas.width = width;
                canvas.height = height;
                streaming = true;
            }
        }, false );

        const canvas = document.querySelector( 'canvas' );          // Select by element type
        const captureButton = document.getElementById( 'capture' ); // Select by id

        captureButton.addEventListener( 'click', ( event ) => {

            takepicture( );
        }, false );

        function takepicture( ) {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext( '2d' ).drawImage( video, 0, 0, width, height );

            // Start downloading (thanks to the 'download' attribute of the link)
            const dataURL = canvas.toDataURL( 'image/png' );
            captureButton.href = dataURL;
        }
    }
