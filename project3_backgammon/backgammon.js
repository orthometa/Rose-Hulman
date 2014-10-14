/*
Circuit drawer made by Andreas Palsson and Igor Ramon
*/

var gl;
var points = [];
var usedSpaceX = [];
var usedSpaceY = [];
var numPoints = 0;
var maxPoints = 1000;
var mouseSize = 8;
var canvas;

var drawingLine = false;
var linePoints = [];

var TYPE = 0;
var numDevices = 0;
var maxDevices = 30;
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
  
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.79, 0.79, 0.79, 1.0 );
    	
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
			
	var maxVertices = 1000;
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, maxVertices*8, gl.STATIC_DRAW );
	
	points = [];

    // Associate our shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	
	
	render();
};

function render() {
	console.log("render");
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	gl.drawArrays( gl.LINES, 0, points.length );

}