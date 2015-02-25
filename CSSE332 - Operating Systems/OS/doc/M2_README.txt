Authors:  Andrew Davidson and Andreas Palsson

To build our operating system, navigate to the project's root directory and type "chmod +x compileOS.sh" to make sure that your computer recognizes the shell file to build the project.
Then, type "./compileOS.sh" to run the script.  A new blank disk image will be created from scratch and the program will be written to it. Then, type "bochs -f opsys.bxrc" to run the operating system.  This does not require an existing disk image to write to.

Upon booting, the operating system will display the message "Hello world" and then prompt the user to input text with the message "Enter a line".  The user can then type characters or delete them as desired.  Their input will be finalized when they type the enter key.  Then, their message will be echoed back to them and an addition message read from the disk will be displayed.  This program can be tested by typing different characters and deleting.  However, at the current moment, there is no way from the console to repetitively and freely call our interrupt21 (from our main program).


The Operating System now prompts the user for input, echoes what they typed back to them, and prints a string read from the disk. 
