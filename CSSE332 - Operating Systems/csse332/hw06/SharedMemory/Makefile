CC = gcc
CFLAGS = -Wall -c -g
LDFLAGS = -Wall -g

all: client server

server: server.o
	$(CC) -o server server.o $(LDFLAGS)

server.o: server.c
	$(CC) -c server.c  $(CFLAGS)

client: client.o
	$(CC) -o client client.o $(LDFLAGS)

client.o: client.c
	$(CC) -c client.c $(CFLAGS)

clean:
	rm -rf client client.o server server.o *~