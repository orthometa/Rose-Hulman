
// Array with the poins
var points = [];
var vertices = [];
var numPieces = 0;
var buffers = [];
var bufferId;
var bufferId2;
var pieces = [];
var indexToMove = -1;
var pieceToMove;

var program;
var vPosition;
var colorLocation;
var translationLocation;
var translations = [];

var firstClick = true;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    //gl = canvas.getContext("experimental-webgl", {preserveDrawingBuffer:true} );
	gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl )
		alert( "WebGL isn't available" );
	
	//	Create Board
	CreateBoard();
	
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 139/255, 69/255, 19/255, 1.0 );
    
    
	initBuffers();

    initializeShaders();    
	
	colorLocation = gl.getUniformLocation(program, "color");
	
	gl.uniform4f(colorLocation, 0, 0, 1, 1);	
    
	//render();
	
	drawBoard();
	drawPieces();
	
	canvas.addEventListener ("click", function(event) {	
		zeroToOne = vec2(2 * event.clientX/canvas.width - 1, -2 * event.clientY/canvas.height + 1);

		
		if(firstClick) {	
			for(var i = 0; i < pieces.length; i++) {
				if(pieces[i].contains(zeroToOne[0], zeroToOne[1])) {
					indexToMove = i;
					pieceToMove = pieces[i];
					firstClick = false;
					break;
				}			
			}
		} else {
			//console.log(pieces[indexToMove].pieces[0]);
			firstClick = true;
			var transx = Math.round(10*(translations[indexToMove][0] + zeroToOne[0] - pieces[indexToMove].points[0]))/10;
			var transy = Math.round(10*(translations[indexToMove][1] + zeroToOne[1] - pieces[indexToMove].points[1]))/10;
			translations[indexToMove] = vec4(transx, transy, 0, 0);
			
			pieces[indexToMove].points[0] = Math.round(zeroToOne[0]*10)/10;
			pieces[indexToMove].points[1] = Math.round(zeroToOne[1]*10)/10;
			pieces[indexToMove].points[2] = Math.round(zeroToOne[0]*10)/10 + 0.1;
			pieces[indexToMove].points[3] = Math.round(zeroToOne[1]*10)/10 - 0.1;
			
			pieces[indexToMove].x1 = Math.round(zeroToOne[0]*10)/10;
			pieces[indexToMove].y1 = Math.round(zeroToOne[1]*10)/10;
			pieces[indexToMove].x4 = Math.round(zeroToOne[0]*10)/10 + 0.1;
			pieces[indexToMove].y4 = Math.round(zeroToOne[1]*10)/10 - 0.1;
			
			checkIfRemoveOtherPieces(pieces[indexToMove]);
			indexToMove = -1;
			drawBoard();
			drawPieces();
		}
			
	});
};

function checkIfRemoveOtherPieces(piece) {
	for(var i = 0; i < pieces.length; i++) {
		if(piece.id != pieces[i].id && piece.x1 == pieces[i].x1 && piece.y1 == pieces[i].y1) {
			translations[i] = vec4(999, 999, 0, 0);
			drawBoard();
			drawPieces();
			break;
		}
	}
}


function drawBoard() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.vertexAttribPointer(vPosition, bufferId.itemSize, gl.FLOAT, false, 0, 0);
   // gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
	var translationsBoard = vec4(0, 0, 0, 0);
	gl.uniform4fv(translationLocation, translationsBoard);
	
	gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
	//gl.drawArrays(gl.TRIANGLES, 0, bufferId.numItems);
	var r;
	var g;
	var b;
	for(var i = 0; i < bufferId.numItems; i += 3) {
	if(i < bufferId.numItems/2) {
		if(i%2 == 0) {
			r = 1; g = 1; b = 1; }
		else {
			r = 0; g = 0; b = 0; }
	} else {
		if(i%2 != 0) {
			r = 1; g = 1; b = 1; }
		else {
			r = 0; g = 0; b = 0; }
	}
	gl.uniform4f(colorLocation, r, g, b, 1);
	gl.drawArrays(gl.TRIANGLES, i, 3);
	}
}
function drawPieces() {
	for(var i = 0; i < buffers.length; i++) {
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i]);
		gl.vertexAttribPointer(vPosition, buffers[i].itemSize, gl.FLOAT, false, 0, 0);
		gl.uniform4fv(translationLocation, translations[i]);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffers[i].numItems);
	}
}
function initializeShaders() {
	//  Load shaders and initialize attribute buffers    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	// Associate out shader variables with our data buffer    
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	translationLocation = gl.getUniformLocation(program, "translation");
}

function initBuffers() {
	// Load the data into the GPU    
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );
	bufferId.itemSize = 2;
    bufferId.numItems = 3*24;
	x = 0;
	
	
	var x1 = 0.0;
	var y1 = 0.1;
		
	var x2 = 0.1;
	var y2 = 0.1;
		
	var x3 = 0.0;
	var y3 = 0.0;
		
	var x4 = 0.1;
	var y4 = 0;
	for(var i = 0; i < 3; i++) {
		translations[i] = vec4(0, 0, 0, 0);
		bufferId2 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
		
		var corners = [
			  x1, y1,
			  x2, y2,
			  x3, y3,
			  x4, y4];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
		bufferId2.itemSize = 2;
		bufferId2.numItems = 4;
		buffers.push(bufferId2);
		pieces.push(new Piece(i, x1, y1, x4, y4));
		x1 = x1 + 0.3;
		x2 = x2 + 0.3;
		x3 = x3 + 0.3;
		x4 = x4 + 0.3;
	}
}

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}


// Render the points
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
	//gl.drawArrays( gl.TRIANGLE_STRIP, 0, points.length);
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length);
}


function CreateBoard() {

	p = -0.86; 
	points.push( p );
	
	p = -0.9;
	points.push( p );
	
	p = -0.14;
	points.push( p );
	
	p = -0.9;
	points.push( p );
	
	p = -0.86; 
	points.push( p );
	
	p = 0.9;
	points.push( p );
	
	p = -0.14; 
	points.push( p );
	
	p = 0.9;
	points.push( p );
	
	// Create the triangles
	for(var i=-1; i<=1; i+=2)
	{
		for(var j=0; j<2; j++)
		{
			for(var k=0; k<6; k++)
			{
				//p = vec2 (j-0.86+0.12*k, -i*0.9);
				p = j-0.86+0.12*k;
				vertices.push( p );
				
				p = -i*0.9;
				vertices.push( p );
				
				//p = vec2 (j-0.86+0.06+0.12*k, -i*0.2);
				p = j-0.86+0.06+0.12*k;
				vertices.push( p );
				
				p = -i*0.2;
				vertices.push( p ) ;
				
				//p = vec2 (j-0.86+0.12+0.12*k, -i*0.9);
				p = j-0.86+0.12+0.12*k;
				vertices.push( p );
				
				p = -i*0.9; 
				vertices.push( p );
				
			}
		}
	}
}

function Piece(id, x1, y1, x4, y4) {
	this.id = id;
	this.x1 = x1;
	this.y1 = y1;
	this.x4 = x4;
	this.y4 = y4;
	this.points = vec4(x1, y1, x4, y4);
	
	this.contains = function(x, y) {
		/*console.log("click x: " + x);
		console.log("x1: " + this.x1);
		console.log("x4: " + this.x4);
		console.log("click y: " + y);
		console.log("y1: " + this.y1);
		console.log("y4: " + this.y4);*/
		if(this.x1 < x && x < this.x4 && this.y1 > y && y > this.y4)
			return true;
		return false;
	}
}
