import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';

if ( WEBGL.isWebGL2Available() ) {
    // WebGL is available
    console.log("WebGL 2 is available.");

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 0, 300 );

    const geometry = new THREE.BoxGeometry( 100, 100, 100 );
    
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.6 );
    scene.add( ambientLight );
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    directionalLight.position.set( 100, 100, 100 );
    scene.add( directionalLight );

    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
    const material = new THREE.MeshPhongMaterial(
        {
            map: textureLoader.load( "textures/brick.png" ),
            bumpMap: textureLoader.load( "textures/brick-map.png" )
        } );
    const box = new THREE.Mesh( geometry, material );   

    scene.add( box );

    function animate() {
        requestAnimationFrame( animate );
        
        // Rotar el cubo solo sobre el eje Y
        box.rotation.y += 0.007;
        
        renderer.render( scene, camera );
    }
    animate();

    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );
}