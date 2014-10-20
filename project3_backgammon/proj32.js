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

var pieceWidth = 0.05;
var pieceHeight = 0.05;

var program;
var vPosition;
var colorLocation;
var translationLocation;
var translations = [];

var player = 1;
var target;
var startPlace;
var player1Return = 0;
var player2Return = 0;

var player1Ready = 0;
var player2Ready = 0;

var playerTriangle = [];
var numPlayerTriangle = [];

var firstClick = true;

var dice1 = -1;
var dice2 = -1;

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
	
	var d1 = document.getElementById("dice1");
	document.getElementById("rollDices").addEventListener("click", function() { 
		dice1 = Math.floor(Math.random() * 6) + 1; 
		dice2 = Math.floor(Math.random() * 6) + 1;
		document.getElementById("dice1").innerHTML = "Dice1: " + dice1;
		document.getElementById("dice2").innerHTML = "Dice2: " + dice2;
	});
	
	canvas.addEventListener ("click", function(event) {	
		zeroToOne = vec2(2 * event.clientX/canvas.width - 1, -2 * event.clientY/canvas.height + 1);
		
		if(firstClick) {
			for(var i = 0; i < pieces.length; i++) {
				if(pieces[i].contains(zeroToOne[0], zeroToOne[1])) {
					indexToMove = i;
					pieceToMove = pieces[i];
					firstClick = false;
					console.log("TRAFF");
					
					for(var i=0; i<2; i++){
						for(var j=0; j<6; j++){
							if(zeroToOne[0]>x && zeroToOne[0]<x+0.1)
								break;
						}
						x = 0.1;
					}	
						
					if(!i)
						startPlace = 12+j;
					else
						startPlace = 18+j;
						
					if(zeroToOne[1]>0)
						startPlace = 11 - startPlace;
					
					if(player==-1)
						startPlace = 5-startPlace;
				
					break;
				}			
			}
		} 
		
		else {
			if(indexToMove == -1)
				return;
			//console.log("OLD SPOT: " + pieces[indexToMove].points);
			firstClick = true;
			var transx = Math.round(10*(translations[indexToMove][0] + zeroToOne[0] - pieces[indexToMove].points[0]))/10;
			var transy = Math.round(10*(translations[indexToMove][1] + zeroToOne[1] - pieces[indexToMove].points[1]))/10;
			
			x = -0.9;
						
			for(var i=0; i<2; i++){
				for(var j=0; j<6; j++){
					if(zeroToOne[0]>x && zeroToOne[0]<x+0.1)
						break;
				}
				x = 0.1;
			}	
				
			if(!i)
				target = 12+j;
				
			else
				target = 18+j;
				
			if(zeroToOne[1]>0)
				target = 11 - target;
			
			if(player==-1)
				target = 5-target;
					
			if(rules()){
				console.log("IF RULES");
				translations[indexToMove] = vec4(transx, transy, 0, 0);
				console.log("TRANSLATIONS: " + translations[indexToMove][0] + ", " + translations[indexToMove][1]);
				
				pieces[indexToMove].points[0] = Math.round(zeroToOne[0]*10)/10;
				pieces[indexToMove].points[1] = Math.round(zeroToOne[1]*10)/10;
				pieces[indexToMove].points[2] = Math.round(zeroToOne[0]*10)/10 + pieceWidth;
				pieces[indexToMove].points[3] = Math.round(zeroToOne[1]*10)/10 - pieceHeight;
				
				pieces[indexToMove].x1 = Math.round(zeroToOne[0]*10)/10;
				pieces[indexToMove].y1 = Math.round(zeroToOne[1]*10)/10;
				pieces[indexToMove].x4 = Math.round(zeroToOne[0]*10)/10 + pieceWidth;
				pieces[indexToMove].y4 = Math.round(zeroToOne[1]*10)/10 - pieceHeight;
				
				pieces[indexToMove].triangle = target;
			}
			
			//console.log("NEW SPOT: " + pieces[indexToMove].points);
			
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
		pieces[i].team == 2 ? gl.uniform4f(colorLocation, 1, 0, 0, 1) : gl.uniform4f(colorLocation, 0, 1, 0, 1)
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
	
	var team = 1;
	x = 0;
	
	var x1 = -0.9;
	var y1 = 0.9;
		
	var x2 = x1 + pieceWidth;
	var y2 = y1;
		
	var x3 = x1;
	var y3 = y1 - pieceHeight;
		
	var x4 = x1 + pieceWidth;
	var y4 = y1 - pieceHeight;
	
	for(var i = 0; i < 15; i++) {
				
		x2 = x1 + pieceWidth;
		y2 = y1;
			
		x3 = x1;
		y3 = y1 - pieceHeight;
		
		x4 = x1 + pieceWidth;
		y4 = y1 - pieceHeight;
	
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
		pieces.push(new Piece(i, x1, y1, x4, y4, team));
		
		y1 -= 0.1;
		
		if(i == 4) {
			team = 2;
			x1 = -0.5;
			y1 = 0.9;
		} else if(i == 7) {
			x1 = 0.1;
			y1 = 0.9;
		} else if(i == 12) {
			team = 1;
			x1 = 0.6;
			y1 = 0.9;
		}
	}
	
	x1 = -0.9;
	y1 = -0.8;
	team = 2;
	
	for(var i = 15; i < 30; i++) {
				
		x2 = x1 + pieceWidth;
		y2 = y1;
			
		x3 = x1;
		y3 = y1 - pieceHeight;
		
		x4 = x1 + pieceWidth;
		y4 = y1 - pieceHeight;
	
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
		pieces.push(new Piece(i, x1, y1, x4, y4, team));
		
		y1 += 0.1;
		
		if(i == 19) {
			team = 1;
			x1 = -0.5;
			y1 = -0.8;
		} else if(i == 22) {
			x1 = 0.1;
			y1 = -0.8;
		} else if(i == 27) {
			team = 2;
			x1 = 0.6;
			y1 = -0.8;
		}
	}
	
	for(var i=0; i<24; i++){
		playerTriangle.push(0);
		numPlayerTriangle.push(0)
	}
		
	playerTriangle[0] = 1;
	numPlayerTriangle[0] = 2
	playerTriangle[5] = -1;
	numPlayerTriangle[5] = 5
	playerTriangle[7] = -1;
	numPlayerTriangle[7] = 3;
	playerTriangle[11] = 1;
	numPlayerTriangle[11] = 5;
	playerTriangle[12] = -1;
	numPlayerTriangle[12] = 5;
	playerTriangle[16] = 1;
	numPlayerTriangle[16] = 3;
	playerTriangle[18] = 1;
	numPlayerTriangle[18] = 5;
	playerTriangle[23] = 1;
	numPlayerTriangle[23] = 2;
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

	for(var i = 0; i < 144; i++) {
//		vertices.push(-0.5);
//		vertices.push(-0.6);
		
		//vertices.push(-0.6);
		//vertices.push(-0.5);
		
//		vertices.push(-0.3);
//		vertices.push(-0.2);
	}
	var x = -0.9;
	var y = 0.9;
	var triangleHeight = 0.8;
	var triangleWidth = 0.1;
	
	for(var i = 0; i < 6; i++) {
		//console.log(x);
		vertices.push(x);
		vertices.push(y);
		vertices.push(x+triangleWidth/2);
		vertices.push(1-triangleHeight);
		vertices.push(x+triangleWidth);
		vertices.push(y);
		x += triangleWidth;
	}
	
	x = 0.1;
	for(var i = 0; i < 6; i++) {
		vertices.push(x);
		vertices.push(y);
		vertices.push(x+triangleWidth/2);
		vertices.push(1-triangleHeight);
		vertices.push(x+triangleWidth);
		vertices.push(y);
		x += triangleWidth;
	}
	
	x = -0.9;
	y = -0.9; 	
	for(var i = 0; i < 6; i++) {
		vertices.push(x);
		vertices.push(y);
		vertices.push(x+triangleWidth/2);
		vertices.push(triangleHeight + y);
		vertices.push(x+triangleWidth);
		vertices.push(y);
		x += triangleWidth;
	}
	
	x = 0.1;	
	for(var i = 0; i < 6; i++) {
		vertices.push(x);
		vertices.push(y);
		vertices.push(x+triangleWidth/2);
		vertices.push(triangleHeight + y);
		vertices.push(x+triangleWidth);
		vertices.push(y);
		x += triangleWidth;
	}
	
	
/*	// Create the triangles
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
				console.log("en triangle");
				
			}
		}
	}
*/
}

function Piece(id, x1, y1, x4, y4, team, triangle) {
	this.id = id;
	this.x1 = x1;
	this.y1 = y1;
	this.x4 = x4;
	this.y4 = y4;
	this.team = team;
	this.points = vec4(x1, y1, x4, y4);
	
	this.contains = function(x, y) {
		/*console.log("click x: " + x);
		console.log("x1: " + this.x1);
		console.log("x4: " + this.x4);
		console.log("click y: " + y);
		console.log("y1: " + this.y1);
		console.log("y4: " + this.y4); */
		if(this.x1 < x && x < this.x4 && this.y1 > y && y > this.y4)
			return true;
		return false;
	}
}


function rules(PlayerReturn) {
	//	Triangle is a vector that represent each one of the triangles. Triangle 1 is the last one of the top and the 24 is the last one of the bottom
	// NumPlayerTriangle is a vector that have the number of pieces in each triangle
	// target is the selected triangle (previously)
	
	// Player 2 will be called player -1 to make the function easier to work with
	
	if(player==-1){
		dice1 = 24 - dice1;
		dice2 = 24 - dice2;
	}
	
	//If the player need to put one piece back to the game
	if(player1Return || player2Return){
		if(target == dice1 || target == dice2){
			if(playerTriangle[target] == player)
				return true;
			else{
				if(NumPlayerTriangle[target] <= 1){
					// -> put here function to remove the opponent piece 
					return true;
				}
			}
		}
	}
	
	// If not, the player just walk normally
	
	else{
		console.log("TARGET: "  + target);
		console.log("startPlace + player*dice1: " + (startPlace + player*dice1));
		console.log("startPlace + player*dice2: " + (startPlace + player*dice2));
		if(target == startPlace + player*dice1 || target == startPlace + player*dice2){			
			if(playerTriangle[target] == player)
					return true;
			else{
				if(NumPlayerTriangle[target] <= 1){
					// -> put here function to remove the opponent piece 
					return true;
				}
			}
		}
		
		else{
			alert('Illegal moviment');
			return false;
		}
	}
	
	alert('You cannot move');
	return false;
}