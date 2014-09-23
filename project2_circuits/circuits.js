
var gl;
var points =[];
var numPoints = 0;
var maxPoints = 100;
var mouseSize = 8;
var canvas;

var drawingLine = false;
var linePoints = [];

var TYPE = 0;
var numDevices = 0;
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
  
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    

	
	
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	
	
	p = new vec2(0, 0);
	for(var i = 0; i < 500; i++)
		points.push(p);
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
	
	points = [];

    // Associate our shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	// Set up event listener	
	canvas.addEventListener ("click", function(event) {
		var point = vec2 (-1 + 2*(event.clientX-mouseSize)/canvas.width, -1 + 2*(canvas.height-event.clientY+mouseSize)/canvas.height);
		switch(TYPE) {
			case 0:
				drawOr(point[0], point[1]);
				break;
			case 1:
				drawAnd(point[0], point[1]);
				break;
			case 2:
				drawNot(point[0], point[1]);
				break;
			case 3:
				linePoints.push(point);
				if (linePoints.length >= 2) {
					drawLine(linePoints);
					linePoints = [];
				}
			default:
				break;
		}
				
	});
	
	var menu = document.getElementById ("menu");
	menu.addEventListener ("click", function () {
		if(linePoints.length == 1) {
			alert('FINISH DRAWING YOUR LINE');
			return;
		}
	   switch (menu.selectedIndex) {
	      case 0:
		    TYPE = 0;
			//alert('NOW DRAWING OR');
			break;
		  case 1:
		    TYPE = 1;
			//alert('NOW DRAWING AND');
			break;
		  case 2:
			TYPE = 2;
			//alert('NOW DRAWING NOT');
			break;
		  case 3:
		    TYPE = 3;
			//alert('NOW DRAWING LINES');
			break;
		}
	})
	
	
	render();
};

window.onkeydown = function (e) {
	return;
	if(linePoints.length == 1) {
		alert('FINISH DRAWING YOUR LINE');
		return;
	}
	
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 49) { //1 
		TYPE = 0;
        alert('NOW DRAWING OR');
    } else if (code === 50) { //2
		TYPE = 1;
        alert('NOW DRAWING AND');
    } else if (code === 51) { //3
		TYPE = 2;
        alert('NOW DRAWING NOT');
    } else if (code == 52) {
		TYPE = 3;
		alert('NOW DRAWING LINES');
	}
};

function drawLine(linePoints) {
	points.push(linePoints[0]);
	points.push(linePoints[1]);
	gl.bufferSubData (gl.ARRAY_BUFFER, 0, flatten(points));
	render();
}
function drawNot(x, y) {
	//var points = [];
	
	var p = new vec2(x, y);
	points.push(p);
	
	
	p = new vec2(x, y+0.5);
	points.push(p);	
	points.push(p);
		
	p = new vec2(x+0.25, y+0.25);
	points.push(p);
	points.push(p);
	
	p = new vec2(x, y);
	points.push(p);
	
	
	p = new vec2(x+0.125, y+0.15);
	points.push(p);
	
	p = new vec2(x+0.125, y+0.3);
	points.push(p);
	
	p = new vec2(x+0.08, y+0.225);
	points.push(p);
	
	p = new vec2(x+0.15, y+0.225);
	points.push(p);
	
	
	console.log("drawnot");
	gl.bufferSubData (gl.ARRAY_BUFFER, 0, flatten(points));
	numDevices++;
	render();
}
function drawAnd(x, y) {
	//var points = [];
	
	var p = new vec2(x, y);
	points.push(p);
	
	p = new vec2(x, y+0.5);
	points.push(p);	
	points.push(p);
		
	p = new vec2(x+0.25, y+0.25);
	points.push(p);
	points.push(p);
	
	p = new vec2(x, y);
	points.push(p);
	
	
	
	console.log("drawand");
	gl.bufferSubData (gl.ARRAY_BUFFER, 0, flatten(points));
	numDevices++;
	render();
}

function drawOr(x, y) {
	
//	var points = [];
	
	var p = new vec2(x, y);
	points.push(p);
	
	p = new vec2(x, y+0.5);
	points.push(p);	
	points.push(p);
		
	p = new vec2(x+0.25, y+0.25);
	points.push(p);
	points.push(p);
	
	p = new vec2(x, y);
	points.push(p);
	
	
	p = new vec2(x+0.125, y+0.15);
	points.push(p);
	
	p = new vec2(x+0.125, y+0.3);
	points.push(p);
	
	p = new vec2(x+0.08, y+0.225);
	points.push(p);
	
	p = new vec2(x+0.15, y+0.225);
	points.push(p);
	
	
	console.log("drawor");
	gl.bufferSubData (gl.ARRAY_BUFFER, 0, flatten(points));
	numDevices++;
	render();
}
function render() {
	console.log("render");
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	gl.drawArrays( gl.LINES, 0, points.length );
	//requestAnimFrame (render);

}
	
