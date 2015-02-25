#ifndef UTILITY_H_
#define UTILITY_H_

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

/* 
 * The function signatures below are for utility functions
 * that are used by barbers and customers.
 */

void leaveBarbershop(char Who[]);

void takeSeat(char Who[], int seats);

void getHaircut(char Who[], int seats);

void cutHairReady(char Who[], int seats);

void cutHairDone(char Who[], int seats);

void takeNap(char Who[]);

#endif /* UTILITY_H_ */
