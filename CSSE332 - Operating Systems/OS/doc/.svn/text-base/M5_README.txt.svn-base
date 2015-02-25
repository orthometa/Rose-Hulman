Authors:  Andrew Davidson and Andreas Palsson

To build our operating system, navigate to the project's root directory and type "chmod +x compileOS.sh" to make sure that your computer recognizes the shell file to build the project.
Then, type "./compileOS.sh" to run the script.  A new blank disk image will be created from scratch and the program will be written to it. Then, type "bochs -f opsys.bxrc" to run the operating system.  This does not require an existing disk image to write to.

Upon booting, the operating system will display the message SHELL> and wait for user input. The user can use 6 commands:
 - type <filename>
 - execute <filename>
 - dir
 - delete <filename>
 - copy <filename_1> <filename_2>
 - create <filename>
 - kill <process>
 - execforeground <filename>
e.g.
 - type messag
 - execute tstpr2
 - delete messag
 - copy messg2 m3
 - dir
 - create newFile
 - kill 1
 - execforeground phello

If the file doesn't exist, the message "File not found" will be printed.

The input is parsed by first finding the first occurence of a blankspace. Everything before the blank space is part of the command, and everything behind it is part of the argument.

If the command is type, readFile is called (by calling interrupt), loading the file into a buffer, and printString is called (also by calling interrupt).

If the command is execute, the method executeProgram is called via an interrupt. This method loads the program into memory and launches it.

If the command is delete, the method deleteFile in the kernel is called.  This searches for the file and deletes it or prints file not found if it fails to find the file.

If the command is copy, the original file is read in, the number of sectors is calculated, and the file is written with the name supplied.

If the command is dir, the files and corresponding file sizes (in sectors) from the directory are printed.

If the command is create, the user is repeatedly prompted for lines until the user enters an empty line. These lines are put in a buffer and this buffer is then written to the file.

If the command is kill, the given process id will be killed. This is done by setting its active attribute to 0, and therefore it will never be scheduled again.

If the command is execforeground, the program will be executed and the shell will stop running until the program has terminated.

No other commands are recognized by the operating system. If the user tries to execute a non-existing command, "Bad command" will be printed.

All the mentioned functionality can be tested entering the following commands:
 - type nofile
 - type messag
 - type nofile

 - execute nofile
 - execute tstpr2
 - execute nofile

 - dir

 - copy messag m2
 - type m2

 - copy tstpr2 t3
 - execute t3

 - create file
 - type file
 - delete file
 - type file

 - execute phello
 - kill 1
 - execforeground phello
