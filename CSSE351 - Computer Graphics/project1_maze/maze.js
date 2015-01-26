/*
Each cell consists of 8 points, with lines drawn between every second point, i.e. point 1 to 2, point 3 to 4, point 5 to 6, point 7 to 8.

*/
var gl;
var points;

var cells;

var iMax = 10;
var jMax = 10;
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );  
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl )  
		alert( "WebGL isn't available" ); 

 	
	points = [];
	cells = new Array();

	initArray(iMax, jMax);
	createPoints();
	createNeighbors();
	
	createMaze();
	createEntranceAndExit();
	 
    //  Configure WebGL
    gl.viewport( 0, 0, 400, 400);//canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function createEntranceAndExit() {
	index = points.indexOf(cells[0][0].p32);
	points.splice(index, 1);
	index = points.indexOf(cells[0][0].p12);
	points.splice(index, 1);
	
	index = points.indexOf(cells[cells.length - 1][cells[0].length - 1].p41);
	points.splice(index, 1);
	index = points.indexOf(cells[cells.length - 1][cells[0].length - 1].p22);
	points.splice(index, 1);
}
//Use DFS to create maze.
function createMaze() {
	var totalCells = iMax * jMax;
	var stack = new Array();
	var currentCell = cells[5][5];
	stack.push(currentCell);
	var visitedCells = 1;
	var nextCell = -1;
	var i = 0;
	var index = 0;
	var neighborExists;
	while(visitedCells < totalCells) {
		i = 0;
		neighborExists = false
		var hej = Math.floor(Math.random() * 4);
		
		nextCell = -1;
		
		//This for-loop checks if currentCell has any neighbors with all their walls up
		for(var i = 0; i < 4; i++) {
			if(currentCell.neighbors[i] != -1 && currentCell.neighbors[i].hasAllWallsUp) {
					neighborExists = true;
					break;
			}
		}
	
		while(neighborExists) {			
			i = Math.floor(Math.random() * 4);

			nextCell = currentCell.neighbors[i];
			if(nextCell != -1 && nextCell.hasAllWallsUp) {
				break;
			}
		} 

		if(nextCell != -1 && nextCell.hasAllWallsUp) {
			if(i == 0) 
				removeUpperWall(currentCell, nextCell);
			 else if(i == 1) 
				removeRightWall(currentCell, nextCell);				
			 else if(i == 2) 
				removeLowerWall(currentCell, nextCell);
			 else if(i == 3) 
				removeLeftWall(currentCell, nextCell);
			
			
			stack.push(currentCell);
			currentCell = nextCell;
			visitedCells++;
		} else {
			currentCell = stack.pop();
			if(currentCell == undefined)
				break;
		}
		
	}
}

//Remove currentCell's upper wall and nextCell's lower wall
function removeUpperWall(currentCell, nextCell) {
	index = points.indexOf(currentCell.p42);
	points.splice(index, 1);
	index = points.indexOf(currentCell.p31);
	points.splice(index, 1);
	currentCell.hasAllWallsUp = false;
	index = points.indexOf(nextCell.p11);
	points.splice(index, 1);
	index = points.indexOf(nextCell.p21);
	points.splice(index, 1);
	nextCell.hasAllWallsUp = false;
}

//Remove currentCell's right wall and nextCell's left wall
function removeRightWall(currentCell, nextCell) {
	index = points.indexOf(currentCell.p22);
	points.splice(index, 1);
	index = points.indexOf(currentCell.p41);
	points.splice(index, 1);
	currentCell.hasAllWallsUp = false;
	index = points.indexOf(nextCell.p32);
	points.splice(index, 1);
	index = points.indexOf(nextCell.p12);
	points.splice(index, 1);
	nextCell.hasAllWallsUp = false;
}

//Remove currentCell's left wall and nextCell's right wall
function removeLeftWall(currentCell, nextCell) {
	index = points.indexOf(currentCell.p32);
	points.splice(index, 1);
	index = points.indexOf(currentCell.p12);
	points.splice(index, 1);
	currentCell.hasAllWallsUp = false;
	index = points.indexOf(nextCell.p22);
	points.splice(index, 1);
	index = points.indexOf(nextCell.p41);
	points.splice(index, 1);
	nextCell.hasAllWallsUp = false;
}

//Remove currentCell's lower wall and nextCell's upper wall
function removeLowerWall(currentCell, nextCell) {
	index = points.indexOf(currentCell.p11);
	points.splice(index, 1);
	index = points.indexOf(currentCell.p21);
	points.splice(index, 1);
	currentCell.hasAllWallsUp = false;
	index = points.indexOf(nextCell.p42);
	points.splice(index, 1);
	index = points.indexOf(nextCell.p31);
	points.splice(index, 1);
	nextCell.hasAllWallsUp = false;
}

//Initialize the array of arrays
function initArray(iMax, jMax) {
	for (i=0;i<iMax;i++) {
		cells[i]=new Array();
		for (j=0;j<jMax;j++) {
			cells[i][j]=0;
		}
	}
}

//Create the points used to draw lines 
function createPoints() {
	for(var i = 0; i <= 0.9; i += 0.1) {
		for(var j = 0; j <= 0.9; j += 0.1) {
			p11 = vec2(i, j);
			p12 = vec2(i, j);
			points.push(p11);  
			
			p21 = vec2(i + 0.1, j);
			p22 = vec2(i + 0.1, j);
			points.push(p21);
			points.push(p22);
			
			p41 = vec2(i + 0.1, j + 0.1);
			p42 = vec2(i + 0.1, j + 0.1);
			points.push(p41);
			points.push(p42);
			
			p31 = vec2(i, j + 0.1);
			p32 = vec2(i, j + 0.1);
			points.push(p31);
			points.push(p32);
			
			points.push(p12);
		
			var c = new Cell(p11, p12, p21, p22, p31, p32, p41, p42);
			cells[Math.round(i*10)][Math.round(j*10)] = c;
		}
	}
}

//Initialize the cell's neighbors. A cell's upper neighbor has index 0, the right neighbor has index 1 etc in the array cells[i][j].neighbor
function createNeighbors() {
	for(var i = 0; i < cells.length; i++) {
		for(var j = 0; j < cells[i].length; j++) {
			if(j == cells[i].length - 1)
				cells[i][j].neighbors.push(-1);
			else
				cells[i][j].neighbors.push(cells[i][j+1]);
			
			if(i == cells.length - 1)
				cells[i][j].neighbors.push(-1);
			else
				cells[i][j].neighbors.push(cells[i+1][j]);
				
			if(j == 0)
				cells[i][j].neighbors.push(-1);
			else
				cells[i][j].neighbors.push(cells[i][j-1]);
				
			if(i == 0)
				cells[i][j].neighbors.push(-1);
			else
				cells[i][j].neighbors.push(cells[i-1][j]);
		}
	}
}


function Cell(p11, p12, p21, p22, p31, p32, p41, p42) {
	this.p11 = p11;
	this.p12 = p12;
	this.p21 = p21;
	this.p22 = p22;
	this.p31 = p31;
	this.p32 = p32;
	this.p41 = p41;
	this.p42 = p42;
	this.neighbors = [];
	this.hasAllWallsUp = true;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	gl.drawArrays( gl.LINES, 0, points.length );
}


