
var canvas;
var gl;
var colorLoc;
var modelViewLoc;
var projectionLoc;
var useTexturesLoc;

var vertices = [];
var colors = [];
var indices = [];

var numTimesToSubdivide = 4;

var cubeSize = 10;
var cubeSize2 = cubeSize / 2.0;

var projection;
var modelView;
var aspect;


var index = 0;

var iBuffer;
var sphereBuffer;
var vBuffer;
var vPosition;
var program;
var lpostBuffer;
var lpostBuffer2;
var buffer;
var sampler;


var lpostBuffers = [];
var lpostVertices = [];

var tBuffer;
var vTexCoord;

var nBuffer;
var nBuffer2;
var vNormal;

var cBuffer;
var vColor;
	
var spherePointsArray = [];
var normalsArray = [];
var lampNormalsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texSize = 64;
var numRows = 8;
var numCols = 8;
var myTexels = new Uint8Array(4*texSize*texSize);


var vertices = [
	   vec4(0.0, 0.0-10, cubeSize, 1.0),
	   vec4(0.0, cubeSize-10, cubeSize, 1.0),
	   vec4(cubeSize, cubeSize-10, cubeSize, 1.0),
	   vec4(cubeSize, 0.0-10, cubeSize, 1.0),
	   vec4(0.0, 0.0-10, 0.0-1000, 1.0),
	   vec4(0.0, cubeSize-10, 0.0-1000, 1.0),
	   vec4(cubeSize, cubeSize-10, 0.0-1000, 1.0),
	   vec4(cubeSize, 0.0-10, 0.0-1000, 1.0)
	];

var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    ];

var texCoord = [
		vec2(0,0),
		vec2(0,2),
		vec2(2,2),
		vec2(2,0)
];

var transx = 0, transy = 0, transz = 0;

colors = [
	    vec4(1.0, 0.0, 0.0, 1.0),  // red
		vec4(1.0, 1.0, 0.0, 1.0),  // yellow
		vec4(0.0, 1.0, 0.0, 1.0),  // green
		vec4(0.0, 0.0, 1.0, 1.0),  // blue
		vec4(1.0, 0.0, 1.0, 1.0),  // magenta
		vec4(0.0, 1.0, 1.0, 1.0)   // cyan
	];
	
	// Load indices to represent the triangles that will draw each face	
	indices = [
	   1, 0, 3, 3, 2, 1,  // front face
	   2, 3, 7, 7, 6, 2,  // right face
	   3, 0, 4, 4, 7, 3,  // bottom face
	   6, 5, 1, 1, 2, 6,  // top face
	   4, 5, 6, 6, 7, 4,  // back face
	   5, 4, 0, 0, 1, 5   // left face
	];

var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333, 1);
    
var lightPosition = vec4(30.0, 10.0, -100.0, 0.0 );
var lightAmbient = vec4(0.8, 0.8, 0.8, 1.0 );
var lightDiffuse = vec4( 1, 1, 1, 1.0 );
var lightSpecular = vec4( 0.7, 0.7, 0.7, 1.0 );

var materialAmbient = vec4( 1.0, 0.5, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.3, 1.0 );
var materialSpecular = vec4( 1.0, 0.8, 0.7, 1.0 );
var materialShininess = 30.0;

var tex;
var texture;

var lookx = 5;
var looky = 5;

function triangle(a, b, c) {
	normalsArray.push(a);
    normalsArray.push(b);
    normalsArray.push(c);
	 
    spherePointsArray.push(a); 
    spherePointsArray.push(b); 
    spherePointsArray.push(c);     
    index += 3;
}

function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = normalize(mix( a, b, 0.5), true);
        var ac = normalize(mix( a, c, 0.5), true);
        var bc = normalize(mix( b, c, 0.5), true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { // draw tetrahedron at end of recursion
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

function quad(a, b, c, d) {
	texCoordsArray.push(texCoord[0]);
	 
	texCoordsArray.push(texCoord[1]);
	 
    texCoordsArray.push(texCoord[2]);
	texCoordsArray.push(texCoord[0]);

    texCoordsArray.push(texCoord[2]);
	texCoordsArray.push(texCoord[3]);
}

// Each face determines two triangles
function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

window.onkeydown = function(e) {
	var key = e.keyCode ? e.keyCode : e.which;
	
	/*
	 * when an arrow key is pressed - translate everything else.
	 * when WASD is pressed, change lookAt parameters 
	 */
	if(key == 37) {
		transx += 1;
	} else if(key == 38) {
		transz += 1;
	} else if(key == 39) {
		transx -= 1;
	} else if(key == 40) {
		transz -= 1;
	} else if(key == 65) {
		//theta[1] -= 10;
		lookx -= 1;
	} else if(key == 68) {
		//theta[1] += 10;
		lookx += 1;
	} else if(key == 87) {
		//theta[0] += 10;
		looky += 1;
	} else if(key == 83) {
		//theta[0] -= 10;
		looky -= 1;	
	}	
	render(transx,transy,transz);
}
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
	aspect = canvas.width / canvas.height;
    gl.clearColor( 0.3, 0.3, 0.8, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	
    //  Load shaders and initialize attribute buffers    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
		
	//Initialize the texels and textures
	setupTexels();
	setupTexture();
	    
	//Get all the locations of the uniforms from the shader
	getUniformLocs();
	
	//Calculate the needed products to be able to implement lighting
	calculateLightProducts();
		
	//Create the sphere and initialize the buffer
	tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	initSphereBuffer();
	
	// Load vertices and colors for cube faces
	colorCube();
	initRoadBuffer();
	
	//Create the light post vertices and initialize the buffers
	setupLightPostVertices(30);
	initLightPostBuffers(30);
	
	initVPosition();
	initIndexBuffer();
	
	initTexBuffer();
	initVTexCoord();
	
	initNormalsBuffer();
    initVNormal();
    render(0, 0, 0);
};
function render(x,y,z)
{		
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	drawSphere(x,y,z); 
	drawRoad(x,y,z);
	for(var i = 0; i < lpostBuffers.length; i++)
		drawLampPost(x,y,z,i);		
};

function drawRoad(x,y,z) {
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray(vTexCoord);
	gl.uniform1i(useTexturesLoc, true);
	gl.bindTexture (gl.TEXTURE_2D, texture);
	
	//USE THIS FOR TRANSLATION 
	tz1 = mat4 (1.0, 0.0, 0.0, -cubeSize2+x,
			   0.0, 1.0, 0.0, -cubeSize2+y,
			   0.0, 0.0, 1.0, -cubeSize2+20+z,
			   0.0, 0.0, 0.0, 1.0);
			   
	tz2 = mat4 (1.0, 0.0, 0.0, cubeSize2,
			   0.0, 1.0, 0.0, cubeSize2,
			   0.0, 0.0, 1.0, cubeSize2,
			   0.0, 0.0, 0.0, 1.0);
	
	setupProjections(tz1, tz2);
	for (var i=0; i<6; i++) {
		gl.uniform4fv (colorLoc, colors[i]);
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6*i );
	}
}
function drawLampPost(x, y, z, nr) {
	drawLampPostBottom(x, y, z, nr);
	drawLampPostTop(x, y, z, nr);
}

function drawLampPostBottom(x,y,z, nr) {
	if(nr % 2 == 0) {
		x -= 9;
	}
	gl.bindBuffer( gl.ARRAY_BUFFER, lpostBuffers[nr][0] );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.disableVertexAttribArray(vTexCoord);
	gl.uniform1i(useTexturesLoc, false);
		
	//USE THIS FOR TRANSLATION 
	tz1 = mat4 (1.0, 0.0, 0.0, 9.0+x,
			   0.0, 1.0, 0.0, 0.0+y,
			   0.0, 0.0, 1.0, -10+z,
			   0.0, 0.0, 0.0, 1.0);
			   
	tz2 = mat4 (1.0, 0.0, 0.0, 0,
			   0.0, 1.0, 0.0, 0,
			   0.0, 0.0, 1.0, 0,
			   0.0, 0.0, 0.0, 1.0);
	
	setupProjections(tz1, tz2);
	for (var i=0; i<6; i++) {
		gl.uniform4fv (colorLoc, colors[5-i]);
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6*i );
	}
}

function drawLampPostTop(x,y,z, nr) {
	if(nr % 2 == 0) {
		x -= 7;
	}
	gl.bindBuffer( gl.ARRAY_BUFFER, lpostBuffers[nr][1] );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.disableVertexAttribArray(vTexCoord);
	gl.uniform1i(useTexturesLoc, false);
	
	//USE THIS FOR TRANSLATION 
	tz1 = mat4 (1.0, 0.0, 0.0, 9.0+x,
			   0.0, 1.0, 0.0, 0.0+y,
			   0.0, 0.0, 1.0, -10+z,
			   0.0, 0.0, 0.0, 1.0);
			   
	tz2 = mat4 (1.0, 0.0, 0.0, 0,
			   0.0, 1.0, 0.0, 0,
			   0.0, 0.0, 1.0, 0,
			   0.0, 0.0, 0.0, 1.0);
	
	setupProjections(tz1, tz2);
	for (var i=0; i<6; i++) {
		gl.uniform4fv (colorLoc, colors[i]);
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6*i );
	}
}	
function drawSphere(x,y,z) {
	gl.bindBuffer( gl.ARRAY_BUFFER, sphereBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );	
	gl.disableVertexAttribArray(vTexCoord);	
	gl.uniform1i(useTexturesLoc, false);
			
	//USE THIS FOR TRANSLATION 
	tz1 = mat4 (1.0, 0.0, 0.0, -cubeSize2+5+x,
			   0.0, 1.0, 0.0, -cubeSize2+5+y,
			   0.0, 0.0, 1.0, cubeSize2-10+z,
			   0.0, 0.0, 0.0, 1.0);
			   
	tz2 = mat4 (1.0, 0.0, 0.0, cubeSize2,
			   0.0, 1.0, 0.0, cubeSize2,
			   0.0, 0.0, 1.0, cubeSize2,
			   0.0, 0.0, 0.0, 1.0);
	setupProjections(tz1, tz2);
		
	gl.uniform4fv(colorLoc, vec4(0.99, 0.72, 0.075, 1));
	for( var i=0; i<index; i+=3)  {		
		gl.drawArrays( gl.TRIANGLE_STRIP, i, 3 );
	}	  
}

function initIndexBuffer() {
	iBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
	
}
function initLightPostBuffers(nrOfPosts) {
	for(var i = 0; i < nrOfPosts; i++) {
		lpostBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, lpostBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(lpostVertices[i][0]), gl.STATIC_DRAW );
		
		lpostBuffer2 = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, lpostBuffer2);
		gl.bufferData( gl.ARRAY_BUFFER, flatten(lpostVertices[i][1]), gl.STATIC_DRAW );
		lpostBuffers.push(vec3(lpostBuffer, lpostBuffer2));
	}
}

function initRoadBuffer() {
	vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
}

function initSphereBuffer() {
	sphereBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(spherePointsArray), gl.STATIC_DRAW);
	gl.enableVertexAttribArray( vNormal);
}

function setupLightPostVertices(nrOfPosts) {

	var lampPostHeight = 10;
	var lampPostWidth = 1;
	var lampPostDepth = 1;
	for(var i = 0; i < nrOfPosts; i++) {
		vertices2 = [
		   vec4(0.0	, 0.0	, 0 - i*10, 1.0),
		   vec4(0.0, lampPostHeight, 0 - i*10, 1.0),
		   vec4(lampPostWidth, lampPostHeight, 0 - i*10, 1.0),
		   vec4(lampPostWidth, 0, 0 - i*10, 1.0),
		   vec4(0.0, 0, -lampPostDepth - i*10, 1.0),
		   vec4(0.0, lampPostHeight, -lampPostDepth - i*10, 1.0),
		   vec4(lampPostWidth, lampPostHeight, -lampPostDepth - i*10, 1.0),
		   vec4(lampPostWidth, 0, -lampPostDepth - i*10, 1.0)
		];
		
		vertices3 = [	   
		   //the upper end of the light post
		   vec4(-2*lampPostWidth, lampPostHeight, 0 - i*10, 1.0),
		   vec4(-2*lampPostWidth, lampPostHeight+1, 0 - i*10, 1.0),
		   vec4(lampPostWidth, lampPostHeight+1, 0 - i*10, 1.0),
		   vec4(lampPostWidth, lampPostHeight, 0 - i*10, 1.0),
		   vec4(-2*lampPostWidth, lampPostHeight, -lampPostDepth - i*10, 1.0),
		   vec4(-2*lampPostWidth, lampPostHeight+1, -lampPostDepth - i*10, 1.0),
		   vec4(lampPostWidth, lampPostHeight+1, -lampPostDepth - i*10, 1.0), 
		   vec4(lampPostWidth, lampPostHeight, -lampPostDepth - i*10, 1.0)
		];
		lpostVertices.push([vertices2, vertices3]);
	}
}


function initTexBuffer() {
	tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
}
function initVTexCoord() {
	vTexCoord = gl.getAttribLocation (program, "vTexCoord");
	gl.vertexAttribPointer (vTexCoord, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vTexCoord);
}

function initVPosition() {
	vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function setupTexture() {
	texture = gl.createTexture();
	gl.bindTexture (gl.TEXTURE_2D, texture);
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, myTexels);

 	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);
}

function setupTexels() {
	for (var i=0; i<texSize; i++) {
	   for (var j=0; j<texSize; j++) {
	      var patchx = Math.floor(i/(texSize/numRows));
		  var patchy = Math.floor(j/(texSize/numCols));
		  var c = (patchx%2 !== patchy%2 ? 255 : 0);
		  myTexels[4*i*texSize+4*j] = c;
		  myTexels[4*i*texSize+4*j+1] = c;
		  myTexels[4*i*texSize+4*j+2] = c;
		  myTexels[4*i*texSize+4*j+3] = 255;
		}
	}
}

function getUniformLocs() {
	sampler = gl.getUniformLocation(program, "uSampler");
	useTexturesLoc = gl.getUniformLocation(program, "useTextures");
	colorLoc = gl.getUniformLocation (program, "color");
	modelViewLoc = gl.getUniformLocation (program, "modelView");
	projectionLoc  = gl.getUniformLocation (program, "projection");
}

function calculateLightProducts() {
	
	ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
	gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess );
}

function initNormalsBuffer() {

	nBuffer2 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer2);
	lampNormalsArray = [
		0, 0, 1, 1, 	//front
		1, 0, 0, 1, 	//right
		0, -1, 0, 1, 	//bottom		
		0, 1, 0, 1 , 	//up
		0, 0, -1, 1, 	//back
		-1, 0, 0, 1, 	//left
	];
	gl.bufferData( gl.ARRAY_BUFFER, flatten(lampNormalsArray), gl.STATIC_DRAW );
	gl.enableVertexAttribArray( vNormal);
	
	nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
	gl.enableVertexAttribArray( vNormal);
}

function initVNormal() {
    var vNormal = gl.getAttribLocation( program, "vNormal" );
	
	gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
}

function setupProjections(tz1, tz2) {
	looking = lookAt (vec3(5,5,10), vec3(lookx,looky,0), vec3(0.0, 1.0, 0.0));
	projection = perspective (90.0, aspect, 1, 1000*cubeSize);
	modelView = mult(looking, mult(tz2, tz1));
	gl.uniformMatrix4fv (modelViewLoc, false, flatten(modelView));
	gl.uniformMatrix4fv (projectionLoc, false, flatten(projection));
}