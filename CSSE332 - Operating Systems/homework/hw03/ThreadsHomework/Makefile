CC = gcc

CFLAGS = -Wall -c -g

## A list of options to pass to the linker. 
LDFLAGS = -Wall -g -pthread

## Name the executable program, list source files
PROG = fibonacci
SRCS = fibonacci.c 

## Build the program from the object files (-o option)
$(PROG): fibonacci.o
	$(CC) fibonacci.o -o $(PROG) $(LDFLAGS)

fibonacci.o: fibonacci.c
	$(CC) $(CFLAGS) fibonacci.c

## Remove all the compilation and debugging files
clean: 
	rm -f core $(PROG) fibonacci.o *~
