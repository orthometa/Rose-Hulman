CC = gcc

CFLAGS = -Wall -c -g

## A list of options to pass to the linker. 
LDFLAGS = -Wall -g 

## Name the executable program, list source files
PROG = fileCopy
SRCS = fileCopy.c 

## Build the program from the object files (-o option)
$(PROG): fileCopy.o
	$(CC) fileCopy.o -o $(PROG) $(LDFLAGS)

fileCopy.o: fileCopy.c
	$(CC) $(CFLAGS) fileCopy.c

## Remove all the compilation and debugging files
clean: 
	rm -f core $(PROG) fileCopy.o *~
