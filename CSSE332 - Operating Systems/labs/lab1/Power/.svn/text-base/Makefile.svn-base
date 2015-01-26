CC = gcc

CFLAGS = -Wall -c -g

## A list of options to pass to the linker. 
LDFLAGS = -Wall -g -lm

## Name the executable program, list source files
PROG = power
SRCS = power.c 

## Build the program from the object files (-o option)
$(PROG): power.o
	$(CC) power.o -o $(PROG) $(LDFLAGS)

power.o: power.c
	$(CC) $(CFLAGS) power.c

## Remove all the compilation and debugging files
clean: 
	rm -f core $(PROG) power.o *~
