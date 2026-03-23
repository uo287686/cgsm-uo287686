import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';

if ( WEBGL.isWebGL2Available() ) {
    // WebGL is available
    console.log("WebGL 2 is available.");

    const scene = new THREE.Scene();
    
    // Luz ambiental para mejor visualización general
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 0, 300 );

    const geometry = new THREE.BoxGeometry( 100, 100, 100 );

    const sphereGeometry = new THREE.BufferGeometry();
    const sphereRadius = 100;
    const widthSegments = 32;
    const heightSegments = 16;
       
    const sphereVertices = [];
    const sphereIndices = [];
    const sphereUVs = [];
       
    for (let stack = 0; stack <= heightSegments; stack++) {
        const phi = stack * Math.PI / heightSegments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
    
        for (let slice = 0; slice <= widthSegments; slice++) {
            const theta = slice * 2 * Math.PI / widthSegments; 
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
     
            sphereVertices.push(sphereRadius * sinPhi * cosTheta, sphereRadius * cosPhi, sphereRadius * sinPhi * sinTheta);
            
            // Agregar coordenadas UV (invertidas en V para orientación correcta)
            const u = slice / widthSegments;
            const v = 1.0 - (stack / heightSegments);
            sphereUVs.push(u, v);
        }
    }
     
    // Conectamos los vértices de cada fila con los de la siguiente
    for (let stack = 0; stack < heightSegments; stack++){
        for (let slice = 0; slice < widthSegments; slice++){
            const a = stack * (widthSegments + 1) + slice;
            const b = a + widthSegments + 1;
     
            sphereIndices.push(a, b, a + 1);
            sphereIndices.push(b, b + 1, a + 1);
        }
    }
       
    sphereGeometry.setIndex(sphereIndices);
    sphereGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(sphereVertices), 3));
    sphereGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(sphereUVs), 2));
    sphereGeometry.computeVertexNormals();
       
    const mapUrl = "../textures/mapa.png";   // The file used as texture
    const textureLoader = new THREE.TextureLoader( );  // The object used to load textures
    const map = textureLoader.load( mapUrl, ( loaded ) => { renderer.render( scene, camera ); } );
    const sphereMaterial = new THREE.MeshPhongMaterial( { map: map, side: THREE.DoubleSide, shininess: 80 } );
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);

    scene.add( sphere );
    
    // Crear esfera de atmósfera con nubes
    const atmosphereGeometry = new THREE.SphereGeometry(110, 32, 16);
    
    const cloudsUrl = "../textures/blanco.png";
    const cloudsLoader = new THREE.TextureLoader();
    const cloudTexture = cloudsLoader.load(cloudsUrl);
    
    const atmosphereMaterial = new THREE.MeshLambertMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.position.set(0, 0, 0);
    
    scene.add(atmosphere);
 
    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );
}