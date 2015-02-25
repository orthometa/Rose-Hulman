#include "utility.h"

/* 
 * The functions below are utility functions
 * that are used by barbers and customers.
 */

void
leaveBarbershop(char Who[])
{
  printf("%s left the barber shop.  All seats are full.\n", Who);
}

void
takeSeat(char Who[], int seats)
{
  printf("%s has taken a seat.  There are %d open seats.\n", Who, seats);
}

void
getHaircut(char Who[], int seats)
{
  printf("%s is getting his hair cut.  There are %d open seats.\n",
         Who, seats);
  usleep(1);
}

void
cutHairReady(char Who[], int seats)
{
  usleep(1);
  printf("%s is ready to cut hair.  There are %d open seats.\n", Who, seats);
}

void
cutHairDone(char Who[], int seats)
{
  usleep(10+rand()%10);
  printf("%s is done cutting hair.\n", Who);
}

void
takeNap(char Who[])
{
  printf("%s is taking a nap.\n", Who);
  usleep(1+rand()%20);
  printf("%s is done napping.\n", Who);
}
