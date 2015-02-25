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
          legend: { position: 'bottom' }
        };


        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    </script>

  </head>
  <body>

  	<div id="Top">
  		<h1 align="center"> Twitter Feelings <h1>
  	</div>

  	<div id="container">
      <div id="chart_div" style="width: 900px; height: 500px"></div>

      <form action="./index.jsp">
    <input type="submit" class="btn btn-primary center" value="New Search">
</form> 
  		
  	</div>

  	<div id="foot">
 	</div>


    
    <script src="http://code.jquery.com/jquery.js"></script>
  </body>
</html>
