CC = gcc

CFLAGS = -Wall -c -g -lm

## A list of options to pass to the linker. 
LDFLAGS = -Wall -g -lm

## Name the executable program, list source files
PROG = inv_list
SRCS = chunk.c list.c data.c inv_list.c

## Build the program from the object files (-o option)
$(PROG): inv_list.o chunk.o list.o data.o
	$(CC) inv_list.o chunk.o list.o data.o -o $(PROG) $(LDFLAGS)


chunk.o: chunk.c
	$(CC) $(CFLAGS) chunk.c

list.o: list.c
	$(CC) $(CFLAGS) list.c

data.o: data.c
	$(CC) $(CFLAGS) data.c

inv_list.o: inv_list.c
	$(CC) $(CFLAGS) inv_list.c


## Remove all the compilation and debugging files
clean: 
	rm -f core $(PROG) inv_list.o list.o data.o chunk.o *~
