#include  <stdio.h>
#include  <stdlib.h>
#include  <sys/types.h>
#include <sys/wait.h>
#include  <sys/ipc.h>
#include  <sys/shm.h>
#include  <string.h>
#include  <unistd.h>
#include <semaphore.h>


/* A struct is not really needed here. However, if the shared memory region 
   is to hold variables of different types, then a struct must be used to
   specify the type and the number of variables to be stored in the shared
   memory region.
*/
typedef struct {
  sem_t s;
  sem_t t;
} sharedMemoryStruct;



/******************/
/*** Prototypes ***/
/******************/

void child1();
void child2();

int createSharedMemoryRegion(key_t key);

sharedMemoryStruct* attachSharedMemoryRegion(int ShmID);


void locateAndAttachSharedMemory(key_t key, sharedMemoryStruct **ShmPTR);
