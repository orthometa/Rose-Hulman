## Author: Andreas Palsson, Andrew Davidson
CC = gcc

CFLAGS = -Wall -c -g

## A list of options to pass to the linker. 
LDFLAGS = -Wall -g -lm -pthread

## Name the executable program, list source files
PROG = airlinereservation
SRCS = airlinereservation.c airplane.c 

## Build the program from the object files (-o option)
$(PROG): airlinereservation.o airplane.o
	$(CC) airlinereservation.o airplane.o -o $(PROG) $(LDFLAGS)

airlinereservation.o: airlinereservation.c
	$(CC) $(CFLAGS) airlinereservation.c

airplane.o: airplane.c
	$(CC) $(CFLAGS) airplane.c

## Remove all the compilation and debugging files
clean: 
	rm -f core $(PROG) airlinereservation.o airplane.o *~
