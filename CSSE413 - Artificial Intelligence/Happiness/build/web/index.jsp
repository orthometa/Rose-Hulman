<!DOCTYPE html>
<html>
  <head>
<script type="text/javascript">
window.onload = function(){
    var buttonGo = document.getElementsByTagName('button')[0];
    var box = document.getElementById('load');
    var textbtn = document.getElementById('textbtn');

    buttonGo.onclick = function(){
        box.removeAttribute("class");
        textbtn.setAttribute("class", "hidden");

    }
}
</script>

    <title>Twitter</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
  	<link rel="stylesheet" type="text/css" href="./css/bootstrap-min.css" />
  	<link rel="stylesheet" type="text/css" href="./css/super.css" />
    <link href='http://fonts.googleapis.com/css?family=Roboto:400,300,100' rel='stylesheet' type='text/css'>


  </head>
  <body>

<div id="back">
</div>
    
      	<div id="Top">
      		<p id="question" align="center"> How do people feel recently? <p> 

      	</div>
      	<div id="container" >
          <div id="inputbox">
          </div>
      		<form name="user" action="./AnalysisLogic" method="post" class="form-horizontal">
        		<fieldset>
        			<div class="form-group">
      	  			<img src=""></img>
      	  		</div>
      	  		<div class="form-group">
      				  <!-- <label for="usernameInput" class="col-lg-2 control-label">Username: </label>  -->
        				<div id="#username" class="col-lg-10">
        	       	<input id="inputtext" type="text" class="form-control" name="user" placeholder="                       Who are you interested in">
        	      </div>
      	      </div>
      			  <div class="form-group">
            		<div class="col-lg-10 col-lg-offset-2">
              		<button type="submit" id="btn" class="btn btn-primary"><div id="textbtn" >Find out <img src="imgs/twitter-512.png"></img></div>


    <div id="load" class="hidden">
      <div class="spinner">
  <div class="spinner-container container1">
    <div class="circle1"></div>
    <div class="circle2"></div>
    <div class="circle3"></div>
    <div class="circle4"></div>
  </div>
  <div class="spinner-container container2">
    <div class="circle1"></div>
    <div class="circle2"></div>
    <div class="circle3"></div>
    <div class="circle4"></div>
  </div>
  <div class="spinner-container container3">
    <div class="circle1"></div>
    <div class="circle2"></div>
    <div class="circle3"></div>
    <div class="circle4"></div>
  </div>
</div>



                  </button>
            		</div>
          		</div>      	
          	</fieldset>
        	</form>
      	</div>

  		
  	</div>


    <script src="http://code.jquery.com/jquery.js"></script>
  </body>
</html>