Usage:
./signals <usrname>
e.g.:
./signals addepladde

Ctrl+C will print HANDLED
Alarm handler will print every 5 seconds
Ctrl+\ will show ps <usrname>

Finding the PID of process signals and doing
kill -USR1 <pid>
will display "Enter a pid to kill" in the signals terminal.
The entered pid will be killed.
