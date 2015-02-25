<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
<script type="text/javascript">
window.onload = function(){
    var buttonGo = document.getElementsByTagName('button')[0];
    var box = document.getElementById('load');
    var back = document.getElementById('back');
    var inputbox = document.getElementById('inputbox');
    var inputtext = document.getElementById('inputtext');
    var btn = document.getElementById('btn');
    buttonGo.onclick = function(){
        box.removeAttribute("class");
        back.setAttribute("class", "dark");
        inputbox.setAttribute("class", "dark-in");
        inputtext.setAttribute("class", "form-control dark-type");
        btn.setAttribute("class", "btn btn-primary dark-type");
    }
}
</script>

    <title>Twitter</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="./css/bootstrap-min.css" />
    <link rel="stylesheet" type="text/css" href="./css/super.css" />

  </head>
  <body>

<div id="back">
</div>
    
        <div id="Top">
          <h1 align="center"> Twitter Feelings <h1>
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
                <label for="usernameInput" class="col-lg-2 control-label">Username: </label> 
                <div id="#username" class="col-lg-10">
                  <input id="inputtext" type="text" class="form-control" name="user" placeholder="Username">
                </div>
              </div>
              <div class="form-group">
                <div class="col-lg-10 col-lg-offset-2">
                  <button type="submit" id="btn" class="btn btn-primary">Submit</button>
                </div>
              </div>        
            </fieldset>
          </form>
        </div>

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
      
    </div>



    <script src="http://code.jquery.com/jquery.js"></script>
  </body>
</html>