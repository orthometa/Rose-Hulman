#ifndef SHAREDMEMORY_H_
#define SHAREDMEMORY_H_

#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <string.h>
#include <unistd.h>
#include <semaphore.h>

#define TRUE 1
#define FALSE 0

/*
 * Shared memory struct to hold semaphores.
 */
typedef struct {
  sem_t customerReady; // a customer is waiting for a haircut
  sem_t customerDone;  // a customer acknowledges being called by a barber
  sem_t barberReady;   // a barber is calling a customer
  sem_t barberDone;    // a barber is done cutting hair
  sem_t accessSeats;   // controls access to the waiting room chairs
  int freeSeats;       // empty seats in barbershop
  int done;            // we're done
} sharedMemoryStruct;

typedef int bool;

/* The documentatiion for these functions are provided in the source
 * file.*/
void getSharedMemory(int *ShmID, int key, sharedMemoryStruct **ShmPTR, 
                     bool create);

void detachSharedMemory(sharedMemoryStruct *ShmPTR, char Who[]);

void removeSharedMemory(int ShmID, char Who[]);

#endif /* SHAREDMEMORY_H_ */
