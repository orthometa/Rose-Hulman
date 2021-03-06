# It can get annoying typing gcc commands every time we compile a 
# project, especially if the project is large and consists of several
# files.  Fortunately, there is a utility called "make" that can do 
# the compiling and linking for us.
# We only need to tell make what the files in the project are and 
# how they are related.  Make takes care of the rest.
# Make is so smart that if we modify a few files in a project, it 
# only recompiles those modified files and links them in the executable
# file.

# Running make:
# Make looks in the current directory for a file called Makefile or
# makefile for its build instructions. Run make by typing this command
# at the prompt. 
# >>> make <target>
# Makes takes 0 or typically 1 argument, which is a target.  

# Makefile:
# A makefile is made up of a series of variables and dependency rules 

## Variables:
## The name of the C compiler.  The default is gcc
CC = gcc

## List of options to pass to the C compiler for all your source files
## -g Tells compiler to include extra debugging informaton in its output
## -Wall Give warnings of constructs that look suspect
## -ansi gives warnings or errors if the code does not follow ANSI standards
CFLAGS = -g -Wall -ansi

## A list of options to pass to the linker.  We have an empty list in this
## case
LDFLAGS =

## Name the executable program
PROG = author

# Dependency Rules:
# A rule generally contains a dependency line and a command line
# dependency line <target>: <list_of_dependencies>
# command line \t<command>

## Build the program from the object files
$(PROG): main.o author.o
	$(CC) $(LDFLAGS) main.o author.o -o $(PROG)

## Rules for the source files.  They compile each X.c to make X.o
main.o: main.c author.h
	$(CC) $(CFLAGS) main.c -c -o main.o

author.o: author.c author.h
	$(CC) $(CFLAGS) author.c -c -o author.o


## Remove all the compilation and debugging files
clean: 
	rm -f core $(PROG) main.o author.o *~
