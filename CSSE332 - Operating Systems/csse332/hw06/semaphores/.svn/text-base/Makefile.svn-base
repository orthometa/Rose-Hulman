CC = gcc
DEBUG = -g
CFLAGS = -c -Wall $(DEBUG) -pthread
LDFLAGS = -Wall $(DEBUG) -pthread
PROG = communicatingChildren

$(PROG): communicatingChildren.o
	$(CC) $(LDFLAGS) communicatingChildren.o -o $(PROG)

communicatingChildren.o: communicatingChildren.c communicatingChildren.h
	$(CC) $(CFLAGS) communicatingChildren.c


clean:
	rm -rf $(PROG) communicatingChildren.o *~
