SHELL =  /bin/sh

OUT	= barbershopMain \
		barber \
		customer \

SRC	= barbershopMain.c \
		barber.c \
		customer.c \
		sharedMemory.c \
		utility.c \

HDR	= sharedMemory.h \
		utility.h \

DEP	= $(SRC:%.c=%.d)

OBJ	= $(SRC:%.c=%.o)

PROF	= #-pg
DBG	= -g
OPT	= 

CC	= gcc
CLINK	= gcc

WARN	= -Wall
INC	= -I.
LIB	= -lpthread

CFLAGS	= $(PROF) $(INC) $(DBG) $(WARN) $(OPT)
CLNKFLGS= $(PROF) $(DBG) $(WARN) $(OPT)

all:	 Makefile $(OBJ) $(SRC) $(HDR) $(OUT)
.PHONY : all

%:	%.o sharedMemory.o utility.o
	$(CC) $(CLNKFLGS) -o $@ $^ $(LIB)

clean:
	/bin/rm -f $(OUT) $(OBJ)
.PHONY : clean

print:	$(SRC) $(HDR)
	lpr -p $?
	touch print

%.d:	%.c
	$(SHELL) -ec "$(CC) $(INC) -MM $(CPPFLAGS) $<" \
		| sed "s#$(*).o[ :]*#$@ &#g" > $@

depend:	$(DEP)
.PHONY : depend

tags:
	etags $(SRC) $(HDR)

include $(DEP)
