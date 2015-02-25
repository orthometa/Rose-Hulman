##Andreas Palsson, ANdrew Davidson

CC = gcc

CFLAGS = -Wall -c -g

## A list of options to pass to the linker. 
LDFLAGS = -Wall -g -lm -pthread

## Name the executable program, list source files
PROG = threads
SRCS = threads.c

## Build the program from the object files (-o option)
$(PROG): threads.o
	$(CC) threads.o -o $(PROG) $(LDFLAGS)

threads.o: threads.c
	$(CC) $(CFLAGS) threads.c

## Remove all the compilation and debugging files
clean: 
	rm -f core $(PROG) threads.o *~
