
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

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var ambientColor;

var pointsArray = [];

var index = 0;

var iBuffer;
var sphereBuffer;
var vBuffer;
var vPosition;
var program;
var lpostBuffer;
var lpostBuffer2;

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

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Load vertices and colors for cube faces
	
	vertices = [
	   vec4(0.0, 0.0-10, cubeSize, 1.0),
	   vec4(0.0, cubeSize-10, cubeSize, 1.0),
	   vec4(cubeSize, cubeSize-10, cubeSize, 1.0),
	   vec4(cubeSize, 0.0-10, cubeSize, 1.0),
	   vec4(0.0, 0.0-10, 0.0-1000, 1.0),
	   vec4(0.0, cubeSize-10, 0.0-1000, 1.0),
	   vec4(cubeSize, cubeSize-10, 0.0-1000, 1.0),
	   vec4(cubeSize, 0.0-10, 0.0-1000, 1.0)
	];
	
	var lampPostHeight = 10;
	var lampPostWidth = 3;
	var lampPostDepth = 3;
	
	vertices2 = [
	   vec4(0.0	, 0.0	, 0, 1.0),
	   vec4(0.0, lampPostHeight, 0, 1.0),
	   vec4(lampPostWidth, lampPostHeight, 0, 1.0),
	   vec4(lampPostWidth, 0, 0, 1.0),
	   vec4(0.0, 0, -lampPostDepth, 1.0),
	   vec4(0.0, lampPostHeight, -lampPostDepth, 1.0),
	   vec4(lampPostWidth, lampPostHeight, -lampPostDepth, 1.0),
	   vec4(lampPostWidth, 0, -lampPostDepth, 1.0),
	   
	];
	
	vertices3 = [	   
	   //the upper end of the light post
	   vec4(-lampPostWidth, lampPostHeight, 0, 1.0),
	   vec4(-lampPostWidth, lampPostHeight+1, 0, 1.0),
	   vec4(0, lampPostHeight+1, 0, 1.0),
	   vec4(0, lampPostHeight, lampPostHeight, 1.0),
	   vec4(-lampPostWidth, lampPostHeight, -lampPostDepth, 1.0),
	   vec4(-lampPostWidth, lampPostHeight+0.1, -lampPostDepth, 1.0),
	   vec4(0, lampPostHeight+1, -lampPostDepth, 1.0), 
	   vec4(0, lampPostHeight, -lampPostDepth, 1.0)
	];
	
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
	
	
	ambientProduct = mult(lightAmbient, materialAmbient);
	console.log(ambientProduct + " :: AA ");
	var ambientProductPlace = gl.getUniformLocation(program, 
       "ambientProduct");
	console.log("BBB :: " + ambientProductPlace);
	gl.uniform4fv(ambientProductPlace, flatten(ambientProduct));
	
    
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
	aspect = canvas.width / canvas.height;
    gl.clearColor( 0.2, 0.2, 0.7, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	//projection = ortho (windowMin, windowMax, windowMin, windowMax, windowMin, windowMax+cubeSize);
	// Register event listeners for the buttons
	
	
	/*var va = vec4(0.0, 0.0, -1.0, 1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333, 1);*/
	
	var va = vec4(0.0, 0.0, -1.0, 1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333, 1);
    
    
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	colorLoc = gl.getUniformLocation (program, "color");
	modelViewLoc = gl.getUniformLocation (program, "modelView");
	projectionLoc  = gl.getUniformLocation (program, "projection");
	
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
	
	lpostBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, lpostBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW );
	
	lpostBuffer2 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, lpostBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices3), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	iBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
	
	
	sphereBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
	//gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//theta[axis] += 0.5;

	drawRoad();
	
	drawLampPost();
		
	drawSphere(); 
	   
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
	translation = [0, 0, 0, 0];
	scale = [1, 1, 1, 1];
	gl.uniform4fv(gl.getUniformLocation(program, "translation"), flatten(translation));
	gl.uniform4fv(gl.getUniformLocation(program, "scale"), flatten(scale));
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
	translation = [0, 0, 0, 0];
	scale = [1, 1, 1, 1];
	gl.uniform4fv(gl.getUniformLocation(program, "translation"), flatten(translation));
	gl.uniform4fv(gl.getUniformLocation(program, "scale"), flatten(scale));
	for (var i=0; i<6; i++) {
		gl.uniform4fv (colorLoc, colors[i]);
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6*i );
	}
	/*
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
	translation = [0, 0, 0, 0];
	scale = [1, 1, 1, 1];
	gl.uniform4fv(gl.getUniformLocation(program, "translation"), flatten(translation));
	gl.uniform4fv(gl.getUniformLocation(program, "scale"), flatten(scale));
	for (var i=0; i<6; i++) {
		gl.uniform4fv (colorLoc, colors[i]);
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6*i );
	}*/
}	
function drawSphere() {

	gl.bindBuffer( gl.ARRAY_BUFFER, sphereBuffer );
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
	
	translation = [12, 12, 2.99, 1];
	gl.uniform4fv(gl.getUniformLocation(program, "translation"), flatten(translation));
	scale = [1, 1, 1, 1];
	gl.uniform4fv(gl.getUniformLocation(program, "scale"), flatten(scale));
	
	gl.uniform4fv(colorLoc, vec4(0.99, 0.72, 0.075, 1));
	for( var i=0; i<index; i+=3) 
       gl.drawArrays( gl.LINE_LOOP, i, 3 );
	  
}
