Authors:  Andrew Davidson and Andreas Palsson

To build our operating system, navigate to the project's root directory and type "chmod +x compileOS.sh" to make sure that your computer recognizes the shell file to build the project.
Then, type "./compileOS.sh" to run the script.  A new blank disk image will be created from scratch and the program will be written to it. Then, type "bochs -f opsys.bxrc" to run the operating system.  This does not require an existing disk image to write to.

Upon booting, the operating system will display the message SHELL> and wait for user input. The user can use 2 commands:
 - type <filename>
 - execute <filename>
e.g.
 - type messag
 - execute tstpr2
If the file doesn't exist, the message "File not found" will be printed.

The input is parsed by first finding the first occurence of a blankspace. Everything before the blank space is part of the command, and everything behind it is part of the argument. 

If the command is type, readFile is called (by calling interrupt), loading the file into a buffer, and printString is called (also by calling interrupt).

If the command is execute, the method executeProgram is called via an interrupt. This method loads the program into memory and launches it. 


No other commands are recognized by the operating system. If the user tries to execute a non-existing command, "Bad command" will be printed.

All the mentioned functionality can be tested entering the following commands:
 - type nofile
 - type messag
 - type nofile

 - execute nofile
 - execute tstpr2
 - execute nofile
