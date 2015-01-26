CC = gcc

CFLAGS = -Wall -c -g -lm

## A list of options to pass to the linker. 
LDFLAGS = -Wall -g -lm

## Name the executable program, list source files
PROG = csf-main
SRCS = file-functions.c string-functions.c csf-main.c

## Build the program from the object files (-o option)
$(PROG): file-functions.o string-functions.o csf-main.o
	$(CC) file-functions.o string-functions.o csf-main.o -o $(PROG) $(LDFLAGS)


file-functions.o: file-functions.c
	$(CC) $(CFLAGS) file-functions.c

string-functions.o: string-functions.c
	$(CC) $(CFLAGS) string-functions.c

csf-main.o: csf-main.c
	$(CC) $(CFLAGS) csf-main.c


## Remove all the compilation and debugging files
clean: 
	rm -f core $(PROG) file-functions.o string-functions.o csf-main.o *~
