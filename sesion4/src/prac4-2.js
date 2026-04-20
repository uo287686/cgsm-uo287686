import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import * as THREE from 'three';

if ( WEBGL.isWebGL2Available() ) {
    // WebGL is available
    console.log("WebGL 2 is available.");

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const camera = new THREE.PerspectiveCamera ( 75, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 20, 0 );

    const listener = new THREE.AudioListener();
    camera.add( listener );

    const audioLoader = new THREE.AudioLoader();
    
    const helper = new THREE.GridHelper( 800, 40, 0x444444, 0x444444 );
    helper.position.y = 0.1;
    scene.add( helper );

    // Objeto Raycaster y variables para almacenar la posición del ratón y el objeto intersectado
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedObject = null;

    const geometry = new THREE.BoxGeometry( 50, 50, 50 );
    const geometry2 = new THREE.BoxGeometry( 50, 50, 50 );
    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures

    const specialFaceMaterial = new THREE.MeshBasicMaterial( { map: textureLoader.load( "textures/cubo.png" ) } );
    const regularFaceMaterial = new THREE.MeshBasicMaterial( { map: textureLoader.load( "textures/brick.png" ) } );

    // A box has 6 faces
    const materials = [
        specialFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
    ];

    const box = new THREE.Mesh( geometry, materials );
    box.name = 'Box1';
    box.position.set( -150, 25, 0 );
    scene.add( box );

    // A box has 6 faces
    const materials2 = [
        regularFaceMaterial,
        specialFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
    ];

    const box2 = new THREE.Mesh( geometry2, materials2 );
    box2.name = 'Box2';
    box2.position.set( 150, 25, 0 );
    scene.add( box2 );

    // Crear fuente de sonido para box (audio1)
    const sound1 = new THREE.PositionalAudio( listener );
    audioLoader.load( "audios/audio1.ogg", ( buffer ) => {
        sound1.setBuffer( buffer );
        sound1.setRefDistance( 20 );
        sound1.setLoop( true );
        sound1.setRolloffFactor( 1 );
    });
    box.add( sound1 );

    // Crear fuente de sonido para box2 (audio2)
    const sound2 = new THREE.PositionalAudio( listener );
    audioLoader.load( "audios/audio2.ogg", ( buffer ) => {
        sound2.setBuffer( buffer );
        sound2.setRefDistance( 20 );
        sound2.setLoop( true );
        sound2.setRolloffFactor( 1 );
    });
    box2.add( sound2 );

    const controls = new FirstPersonControls( camera, renderer.domElement );
    controls.movementSpeed = 70;
    controls.lookSpeed = 0.05;
    controls.noFly = false;
    controls.lookVertical = false;

    const clock = new THREE.Clock( );

    // Animation loop - Animar la escena para girar el cubo sobre el eje Y
    function animate() {
        requestAnimationFrame( animate );

        const delta = clock.getDelta();
        controls.update( delta );

        rayCaster.setFromCamera( mouse, camera );

        // Look for all the intersected objects
        const intersects = rayCaster.intersectObjects( scene.children );
        if ( intersects.length > 0 ) {

            // Sorted by Z (close to the camera)
            if ( intersectedObject != intersects[ 0 ].object ) {

                intersectedObject = intersects[ 0 ].object;
                console.log( 'New intersected object: ' + intersectedObject.name );
            }
        } else {

            intersectedObject = null;
        }
        
        renderer.render( scene, camera );
    }
    animate();

    // Callback para el evento de mousemove para cada vez que se desplace el ratón
    document.body.addEventListener( 'mousemove', ( event ) => {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }, false );

    // Callback para reproducir el sonido al pulsar la barra espaciadora
    document.body.addEventListener( 'keydown', ( event ) => {
        if ( event.code === 'Space' && intersectedObject ) {
            // Obtener el sonido del objeto seleccionado
            if ( intersectedObject.children.length > 0 ) {
                const sound = intersectedObject.children.find( child => child instanceof THREE.PositionalAudio );
                if ( sound && !sound.isPlaying ) {
                    sound.play();
                }
            }
        }
    }, false );

    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );
}