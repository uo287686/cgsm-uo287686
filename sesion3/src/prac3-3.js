import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as THREE from 'three';

if ( WEBGL.isWebGL2Available() ) {
    // WebGL is available
    console.log("WebGL 2 is available.");

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 100, 500 );

    const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    
    //const ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
    //scene.add( ambientLight );
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.2 );
    directionalLight.position.set( 50, 150, 50 );
    directionalLight.castShadow = true;
    scene.add( directionalLight );

    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
    const material = new THREE.MeshPhongMaterial(
        {
            map: textureLoader.load( "textures/brick.png" ),
            bumpMap: textureLoader.load( "textures/brick-map.png" ),
            bumpScale: 1
        } );
    const box = new THREE.Mesh( geometry, material );
    //box.rotation.set( Math.PI / 5, Math.PI / 5, 0 );    

    scene.add( box );

    const controlData = {
        bumpScale: material.bumpScale
    }

    const gui = new GUI( );
    gui.add( controlData, 'bumpScale', -4, 4 ).step(0.1).name( 'bumpScale' );


    const stats = new Stats( );
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    document.body.appendChild( stats.dom );

    // Animation loop - Animar la escena
    function animate() {
        requestAnimationFrame( animate );
        
        // Rotar el cubo solo sobre el eje Y
        box.rotation.y += 0.02;

        material.bumpScale = controlData.bumpScale;
        stats.update( );
        
        renderer.render( scene, camera );
    }
    animate();

    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );
}