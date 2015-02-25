CC = gcc

CFLAGS = -Wall -c -g

## A list of options to pass to the linker. 
LDFLAGS = -Wall -g 

## Name the executable program, list source files
PROG = pointersAndArrays
SRCS = pointersAndArrays.c 

## Build the program from the object files (-o option)
$(PROG): pointersAndArrays.o
	$(CC) pointersAndArrays.o -o $(PROG) $(LDFLAGS)

pointersAndArrays.o: pointersAndArrays.c
	$(CC) $(CFLAGS) pointersAndArrays.c

## Remove all the compilation and debugging files
clean: 
	rm -f core $(PROG) pointersAndArrays.o *~
