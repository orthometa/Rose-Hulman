## Author: Andreas Palsson, Andrew Davidson
all: processes myCopy
CC = gcc
CFLAGS = -Wall -c -g

## A list of options to pass to the linker. 
LDFLAGS = -Wall -g -lm

## Name the executable program, list source files
PROG = processes 
SRCS = processes.c 

## Build the program from the object files (-o option)
processes: processes.o
	$(CC) processes.o -o processes $(LDFLAGS)

myCopy: myCopy.o
	$(CC) myCopy.c -o myCopy $(LDFLAGS)

myCopy.o: myCopy.c
	$(CC) $(CFLAGS) myCopy.c

processes.o: processes.c
	$(CC) $(CFLAGS) processes.c

## Remove all the compilation and debugging files
clean: 
	rm -f core $(PROG) processes.o *~
