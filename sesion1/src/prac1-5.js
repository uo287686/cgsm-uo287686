import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import * as THREE from 'three';
 
if ( WEBGL.isWebGL2Available() ) {
    // WebGL is available
    const scene = new THREE.Scene();
 
    const renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
    const camera = new THREE.PerspectiveCamera ( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 0, 500 );
 
    const boxGeometry = new THREE.BufferGeometry();
    const size = 40;
    const inner = 30;
    const outer = 40;
   
    const boxVertices = new Float32Array( [
        -inner, -inner, inner,  
        inner, -inner, inner,
        inner, inner, inner,    
        -inner, inner, inner,    
       
 
        -inner, -inner, -inner,  
        -inner, inner, -inner,  
        inner, inner, -inner,  
        inner, -inner, -inner,  
       
        -inner, inner, -inner,  
        -inner, inner, inner,    
        inner, inner, inner,    
        inner, inner, -inner,    
       
        -inner, -inner, -inner,
        inner, -inner, -inner,  
        inner, -inner, inner,    
        -inner, -inner, inner,  
       
        inner, -inner, -inner,  
        inner, inner, -inner,  
        inner, inner, inner,    
        inner, -inner, inner,  
 
        -inner, -inner, -inner,  
        -inner, -inner, inner,  
        -inner, inner, inner,    
        -inner, inner, -inner    
    ] );
   
    const boxIndices = [
        0, 1, 2,    0, 2, 3,  
        4, 5, 6,    4, 6, 7,  
        8, 9, 10,   8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ];
   
    boxGeometry.setIndex(boxIndices);
    boxGeometry.setAttribute('position', new THREE.BufferAttribute(boxVertices, 3));
    boxGeometry.computeVertexNormals();
       
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-120, 0, 0);
    box.rotation.set(Math.PI/5, Math.PI / 5, 0);
     
    const cylinderGeometry = new THREE.BufferGeometry();
    const radius = 38;
    const height = 110;
    const segments = 32;
       
    const cylinderVertices = [];
    const cylinderIndices = [];
       
    cylinderVertices.push(0, height/2, 0);
    cylinderVertices.push(0, -height/2, 0);
       
    for ( let i = 0; i <= segments; i++ ) {
        const angle = ( i / segments ) * Math.PI * 2;
        const x = radius * Math.cos( angle );
        const z = radius * Math.sin( angle );
     
        cylinderVertices.push( x,  height / 2, z ); // anillo superior
    }
     
    for ( let i = 0; i <= segments; i++ ) {
        const angle = ( i / segments ) * Math.PI * 2;
        const x = radius * Math.cos( angle );
        const z = radius * Math.sin( angle );
     
        cylinderVertices.push( x, -height / 2, z ); // anillo inferior
    }
     
    const topStart = 2;
    const bottomStart = 2 + segments + 1;
     
    for ( let i = 0; i < segments; i++ ) {
        cylinderIndices.push( 0, topStart + i, topStart + i + 1 );
    }
     
    for ( let i = 0; i < segments; i++ ) {
        cylinderIndices.push( 1, bottomStart + i + 1, bottomStart + i );
    }
     
    for ( let i = 0; i < segments; i++ ) {
        const t0 = topStart    + i;
        const t1 = topStart    + i + 1;
        const b0 = bottomStart + i;
        const b1 = bottomStart + i + 1;
     
        cylinderIndices.push( t0, b0, t1 );
        cylinderIndices.push( b0, b1, t1 );
    }
       
    cylinderGeometry.setIndex(cylinderIndices);
    cylinderGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cylinderVertices), 3));
    cylinderGeometry.computeVertexNormals();
       
    const cylinderMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, 0, 0);
    cylinder.rotation.set(Math.PI/5, 0, 0);
     
    const sphereGeometry = new THREE.BufferGeometry();
    const sphereRadius = 50;
    const widthSegments = 32;
    const heightSegments = 16;
       
    const sphereVertices = [];
    const sphereIndices = [];
       
    for (let stack = 0; stack <= heightSegments; stack++) {
        const phi = stack * Math.PI / heightSegments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
    
        for (let slice = 0; slice <= widthSegments; slice++) {
            const theta = slice * 2 * Math.PI / widthSegments; 
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
     
            sphereVertices.push(sphereRadius * sinPhi * cosTheta, sphereRadius * cosPhi, sphereRadius * sinPhi * sinTheta);
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
    sphereGeometry.computeVertexNormals();
       
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(120, 0, 0);
 

    const houseGeometry = new THREE.BufferGeometry();
    
    const houseVertices = new Float32Array( [
        -40, -40, 0,        
        40, -40, 0,        
        40, 20, 0,    
        -40, 20, 0,  
       
        10, -40, 0,
        10,   0, 0,
        30,   0, 0,
        30, -40, 0,

        -30,  -5, 0,
        -30,  10, 0,
        -10,  10, 0,
        -10,  -5, 0,
        
        0, 70, 0,            
    ] );
   
    const houseIndices = [
        0,  4,  5,
        0,  5,  8,
        0,  8,  3,
 
        7,  1,  2,
        7,  2,  6,
 
        5,  6, 11,
        5, 11,  8,
 
        0,  3,  9,
        0,  9,  8,
 
        6,  2, 10,
        6, 10, 11,
        10,  2,  3,
        10,  3,  9,
 
        3,  2, 12,
    ];
   
    houseGeometry.setIndex( houseIndices );
    houseGeometry.setAttribute( 'position', new THREE.BufferAttribute( houseVertices, 3 ) );
    houseGeometry.computeVertexNormals();
   
    const houseMaterial = new THREE.MeshBasicMaterial( {
        color: 0xffff00,
        side: THREE.DoubleSide
    } );
    const house = new THREE.Mesh( houseGeometry, houseMaterial );
    house.position.set( 240, 0, 0 );
 
    window.addEventListener( 'resize', ( ) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix( );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );
    }, false );
 
    scene.add( box );
    scene.add( cylinder );
    scene.add( sphere );
    scene.add( house );
    renderer.render( scene, camera );
}
else {
    console.error( 'WebGL 2 is not available.' );
}