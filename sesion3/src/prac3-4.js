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
    
    const helper = new THREE.GridHelper( 800, 40, 0x444444, 0x444444 );
    helper.position.y = 0.1;
    scene.add( helper );

    const geometry = new THREE.BoxGeometry( 50, 50, 50 );
    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures

    const specialFaceMaterial = new THREE.MeshBasicMaterial( { map: textureLoader.load( "textures/cubo-mapa-topologico.png" ) } );
    const regularFaceMaterial = new THREE.MeshBasicMaterial( { map: textureLoader.load( "textures/cubo.png" ) } );

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

    const box2 = new THREE.Mesh( geometry, materials );
    box2.position.set( 150, 25, 0 );
    scene.add( box2 );

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

    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );
}