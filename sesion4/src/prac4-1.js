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
    box.position.set( -150, 25, 0 );
    scene.add( box );

    const materials2 = [
        regularFaceMaterial,
        specialFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
        regularFaceMaterial,
    ];

    const box2 = new THREE.Mesh( geometry2, materials2 );
    box2.position.set( 150, 25, 0 );
    scene.add( box2 );

    // Crear fuente de sonido para box (audio1)
    const sound1 = new THREE.PositionalAudio( listener );
    audioLoader.load( "audios/audio1.ogg", ( buffer ) => {
        sound1.setBuffer( buffer );
        sound1.setRefDistance( 10 );
        sound1.setLoop( true );
        sound1.setRolloffFactor( 1 );
    });
    box.add( sound1 );

    // Crear fuente de sonido para box2 (audio2)
    const sound2 = new THREE.PositionalAudio( listener );
    audioLoader.load( "audios/audio2.ogg", ( buffer ) => {
        sound2.setBuffer( buffer );
        sound2.setRefDistance( 10 );
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
        
        renderer.render( scene, camera );
    }
    animate();

    document.body.addEventListener( 'click', () => {
        if ( sound1.buffer && !sound1.isPlaying ) sound1.play();
        if ( sound2.buffer && !sound2.isPlaying ) sound2.play();
    }, { once: true } );

    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );
}