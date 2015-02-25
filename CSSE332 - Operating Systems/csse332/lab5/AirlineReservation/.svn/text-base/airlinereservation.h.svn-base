/*
 * Authors: Andreas Palsson, Andrew Davidson 
 * Date: 2014-02-02
*/

#ifndef __AIRRES_H__
#define __AIRRES_H__

#include "airplane.h"
#define SH_MEM_KEY getuid()

typedef struct { 
  sem_t first_class;
  sem_t coach_class;
  sem_t write_mutex;
  plane plane;

} sharedMemoryStruct;

int createSharedMemoryRegion(key_t key);
sharedMemoryStruct * attachSharedMemoryRegion(int ShmID);
void executeChild(int i, char * filename);
void locateAndAttachSharedMemory(key_t t, sharedMemoryStruct ** ShmPTR);

int book(int i, sharedMemoryStruct * ShmPTR, int ** seats, int n, int wants_coach_seating);
void wait_for_semaphore(sharedMemoryStruct * ShmPTR, int wants_coach_seating);
void post_semaphore(sharedMemoryStruct * ShmPTR, int wants_coach_seating);

void printReceipt(char * filename, sharedMemoryStruct * ShmPTR, int i, int booked_seats, int wants_coach_seating, int * seats);
int rows = COACH_ROWS + FIRST_ROWS;
int across = COACH_ACROSS;


#endif
