
var canvas;
var gl;
var colorLoc;
var modelViewLoc;
var projectionLoc;

var vertices = [];
var colors = [];
var indices = [];

var numTimesToSubdivide = 5;

var cubeSize = 10;
var cubeSize2 = cubeSize / 2.0;
var windowMin = -cubeSize2;
var windowMax = cubeSize + cubeSize2;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;

var projection;
var modelView;
var aspect;

var ctm;

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

var tBuffer;
var vTexCoord;

var cBuffer;
var vColor;
	
var numVertices  = 36;

var pointsArray = [];
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

function triangle(a, b, c) {
     pointsArray.push(a); 
     pointsArray.push(b); 
     pointsArray.push(c);     
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

var roadTexture;
var roadImage;

function quad(a, b, c, d) {
     //pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
	 texCoordsArray.push(texCoord[0]);
	 
     //pointsArray.push(vertices[b]); 
     colorsArray.push(vertexColors[a]); 
	 texCoordsArray.push(texCoord[1]);
	 
     //pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);    
	 texCoordsArray.push(texCoord[2]);
	 
     //pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 
	 texCoordsArray.push(texCoord[0]);

     //pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]); 
	 texCoordsArray.push(texCoord[2]);

     //pointsArray.push(vertices[d]); 
     colorsArray.push(vertexColors[a]); 
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

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Load vertices and colors for cube faces
	colorCube();
	
	
	
	setupLightPostVertices();
	
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
	    
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
	aspect = canvas.width / canvas.height;
    gl.clearColor( 0.2, 0.2, 0.7, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	
	var va = vec4(0.0, 0.0, -1.0, 1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333, 1);
    
    
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	
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
	
	var texture = gl.createTexture();
	gl.bindTexture (gl.TEXTURE_2D, texture);
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, myTexels);
	//gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	//gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
	//gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
 	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 	//gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	//gl.generateMipmap( gl.TEXTURE_2D );
	gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);
	

    
	sampler = gl.getUniformLocation(program, "uSampler");
	colorLoc = gl.getUniformLocation (program, "color");
	modelViewLoc = gl.getUniformLocation (program, "modelView");
	projectionLoc  = gl.getUniformLocation (program, "projection");
	
	
	initSphereBuffer();
	initIndexBuffer();
	initLightPostBuffers();
	
	initColorBuffer();
    	
    vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);
	
    initRoadBuffer();

	
	tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
	
	vTexCoord = gl.getAttribLocation (program, "vTexCoord");
	gl.vertexAttribPointer (vTexCoord, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vTexCoord);
		
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	
	
    render();
};
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	
	drawRoad();
	drawSphere(); 
	drawLampPost();
	
	drawLampPostTop();	
	
	   
	requestAnimFrame (render);
};

function drawRoad() {
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	//USE THIS FOR TRANSLATION 
	tz1 = mat4 (1.0, 0.0, 0.0, -cubeSize2,
			   0.0, 1.0, 0.0, -cubeSize2,
			   0.0, 0.0, 1.0, -cubeSize2+20,
			   0.0, 0.0, 0.0, 1.0);
			   
	tz2 = mat4 (1.0, 0.0, 0.0, cubeSize2,
			   0.0, 1.0, 0.0, cubeSize2,
			   0.0, 0.0, 1.0, cubeSize2,
			   0.0, 0.0, 0.0, 1.0);
	
	looking = lookAt (vec3(cubeSize2,cubeSize2,4*cubeSize), vec3(cubeSize2,cubeSize2,0), vec3(0.0, 1.0, 0.0));
	projection = perspective (45.0, aspect, 1, 1000*cubeSize);
	modelView = mult(looking, mult(tz2, tz1));
	gl.uniformMatrix4fv (modelViewLoc, false, flatten(modelView));
	gl.uniformMatrix4fv (projectionLoc, false, flatten(projection));
	for (var i=0; i<6; i++) {
		gl.uniform4fv (colorLoc, colors[i]);
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6*i );
	}
}

function drawLampPost() {
	gl.bindBuffer( gl.ARRAY_BUFFER, lpostBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	
	//USE THIS FOR TRANSLATION 
	tz1 = mat4 (1.0, 0.0, 0.0, 10.0,
			   0.0, 1.0, 0.0, 0.0,
			   0.0, 0.0, 1.0, 0,
			   0.0, 0.0, 0.0, 1.0);
			   
	tz2 = mat4 (1.0, 0.0, 0.0, 0,
			   0.0, 1.0, 0.0, 0,
			   0.0, 0.0, 1.0, 0,
			   0.0, 0.0, 0.0, 1.0);
	
	looking = lookAt (vec3(cubeSize2,cubeSize2,4*cubeSize), vec3(cubeSize2,cubeSize2,0), vec3(0.0, 1.0, 0.0));
	projection = perspective (45.0, aspect, 1, 1000*cubeSize);
	modelView = mult(looking, mult(tz2, tz1));
	gl.uniformMatrix4fv (modelViewLoc, false, flatten(modelView));
	gl.uniformMatrix4fv (projectionLoc, false, flatten(projection));
	for (var i=0; i<6; i++) {
		gl.uniform4fv (colorLoc, colors[i]);
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6*i );
	}
}

function drawLampPostTop() {
	gl.bindBuffer( gl.ARRAY_BUFFER, lpostBuffer2 );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	
	//USE THIS FOR TRANSLATION 
	tz1 = mat4 (1.0, 0.0, 0.0, 10.0,
			   0.0, 1.0, 0.0, 0.0,
			   0.0, 0.0, 1.0, 0,
			   0.0, 0.0, 0.0, 1.0);
			   
	tz2 = mat4 (1.0, 0.0, 0.0, 0,
			   0.0, 1.0, 0.0, 0,
			   0.0, 0.0, 1.0, 0,
			   0.0, 0.0, 0.0, 1.0);
	
	looking = lookAt (vec3(cubeSize2,cubeSize2,4*cubeSize), vec3(cubeSize2,cubeSize2,0), vec3(0.0, 1.0, 0.0));
	projection = perspective (45.0, aspect, 1, 1000*cubeSize);
	modelView = mult(looking, mult(tz2, tz1));
	gl.uniformMatrix4fv (modelViewLoc, false, flatten(modelView));
	gl.uniformMatrix4fv (projectionLoc, false, flatten(projection));
	for (var i=0; i<6; i++) {
		gl.uniform4fv (colorLoc, colors[i]);
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6*i );
	}
}	
function drawSphere() {

	gl.bindBuffer( gl.ARRAY_BUFFER, sphereBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );	
	
	//USE THIS FOR TRANSLATION 
	tz1 = mat4 (1.0, 0.0, 0.0, -cubeSize2+5,
			   0.0, 1.0, 0.0, -cubeSize2+5,
			   0.0, 0.0, 1.0, -cubeSize2-10,
			   0.0, 0.0, 0.0, 1.0);
			   
	tz2 = mat4 (1.0, 0.0, 0.0, cubeSize2,
			   0.0, 1.0, 0.0, cubeSize2,
			   0.0, 0.0, 1.0, cubeSize2,
			   0.0, 0.0, 0.0, 1.0);
	
	looking = lookAt (vec3(cubeSize2,cubeSize2,4*cubeSize), vec3(cubeSize2,cubeSize2,0), vec3(0.0, 1.0, 0.0));
	projection = perspective (45.0, aspect, 1, 1000*cubeSize);
	modelView = mult(looking, mult(tz2, tz1));
	gl.uniformMatrix4fv (modelViewLoc, false, flatten(modelView));
	gl.uniformMatrix4fv (projectionLoc, false, flatten(projection));
	
	
	
	for( var i=0; i<index; i+=3)  {
		gl.uniform4fv(colorLoc, vec4(0.99, 0.72, 0.075, 1));
       gl.drawArrays( gl.LINE_LOOP, i, 3 );
	}	  
}

function initIndexBuffer() {
	iBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
	
}
function initLightPostBuffers() {
	
	lpostBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, lpostBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW );
	
	lpostBuffer2 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, lpostBuffer2);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices3), gl.STATIC_DRAW );
	
}

function initRoadBuffer() {
	vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
}

function initSphereBuffer() {
	sphereBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
}

function initColorBuffer() {
	
	cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
}


function setupLightPostVertices() {

	var lampPostHeight = 10;
	var lampPostWidth = 1;
	var lampPostDepth = 1;
	vertices2 = [
	   vec4(0.0	, 0.0	, 0, 1.0),
	   vec4(0.0, lampPostHeight, 0, 1.0),
	   vec4(lampPostWidth, lampPostHeight, 0, 1.0),
	   vec4(lampPostWidth, 0, 0, 1.0),
	   vec4(0.0, 0, -lampPostDepth, 1.0),
	   vec4(0.0, lampPostHeight, -lampPostDepth, 1.0),
	   vec4(lampPostWidth, lampPostHeight, -lampPostDepth, 1.0),
	   vec4(lampPostWidth, 0, -lampPostDepth, 1.0)
	];
	
	vertices3 = [	   
	   //the upper end of the light post
	   vec4(-2*lampPostWidth, lampPostHeight, 0, 1.0),
	   vec4(-2*lampPostWidth, lampPostHeight+1, 0, 1.0),
	   vec4(lampPostWidth, lampPostHeight+1, 0, 1.0),
	   vec4(lampPostWidth, lampPostHeight, 0, 1.0),
	   vec4(-2*lampPostWidth, lampPostHeight, -lampPostDepth, 1.0),
	   vec4(-2*lampPostWidth, lampPostHeight+0.1, -lampPostDepth, 1.0),
	   vec4(lampPostWidth, lampPostHeight+1, -lampPostDepth, 1.0), 
	   vec4(lampPostWidth, lampPostHeight, -lampPostDepth, 1.0)
	];
}