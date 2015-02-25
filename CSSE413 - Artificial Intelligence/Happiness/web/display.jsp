<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.util.Iterator"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<%@page import="java.util.TreeMap"%>
<%@page import="java.util.ArrayList"%>
<% TreeMap<Date, Integer> dailyScore = (TreeMap<Date, Integer>)session.getAttribute("dailyScore"); %>

<!DOCTYPE html>

<html>
  <head>
    <title>Twitter</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  	<link rel="stylesheet" type="text/css" href="./css/bootstrap-min.css" />
  	<link rel="stylesheet" type="text/css" href="./css/super.css" />
    <link href='http://fonts.googleapis.com/css?family=Economica|Amatic+SC' rel='stylesheet' type='text/css'>

     <!--Load the AJAX API-->
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">

      // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = google.visualization.arrayToDataTable([
          ['Date', '<%=request.getParameter("user") %>'],
          <%
            Iterator<Date> iter = dailyScore.keySet().iterator();
            SimpleDateFormat sdf = new SimpleDateFormat("MMM dd yyyy");
        
            while (iter.hasNext()){
               Date label = iter.next();
               String textLabel = sdf.format(label);
               out.print("['"+textLabel+"',"+dailyScore.get(label)+"],");
            }
          %>
        ]);

        // Set chart options
        var options = {
          title: 'Happiness Index',
          curveType: 'function',
          backgroundColor: "transparent",
          legend: { position: 'bottom' }
        };


        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    </script>
  </head>
  <body>


      
    <div class="replay">

      <a href="index.jsp"><</a>
    </div>
    <div class="avatar">
        <img src="<%=(String)session.getAttribute("userUrl") %>"></img>
    </div>
          <!-- <div id="container"> -->
          <div class="chart">
      <div id="chart_div" class="chart_div" ></div>
  		</div>
  	<!-- </div> -->

  	<!-- <div id="foot">
 	</div> -->


    
    <script src="http://code.jquery.com/jquery.js"></script>
  </body>
</html>
