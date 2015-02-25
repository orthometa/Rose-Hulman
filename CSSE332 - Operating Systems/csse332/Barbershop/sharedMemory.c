/***************************************************************************
 * This module contains utility functions for managing shared memory regions.
 * Process can use these functions to get a shared memory region, detach a
 * shared memory region, and to remove a shared memory region.
 * 
 ***************************************************************************/

#include "sharedMemory.h"

/***************************************************************************
 * The first call to this function should create a block of shared memory,
 * attach to it, and return by reference the ID of the block and a pointer
 * to its first word.  Subsequent calls should attach to the same block of
 * memory and return by reference the same ID and pointer.
 ***************************************************************************/
void
getSharedMemory(int* ShmID, int key, sharedMemoryStruct **ShmPTR, bool create)
{
  // Request a shared memory space
  size_t size = (create == TRUE)? sizeof(sharedMemoryStruct) : 0;
  int shmflag = (create == TRUE)? IPC_CREAT | 0666 : 0;
  key_t SH_MEM_KEY = (key_t) key;

  *ShmID = shmget(SH_MEM_KEY, size, shmflag);
  if (*ShmID < 0) {
    perror("*** shmget error (server) ***\n");
    exit(1);
  }
     
  // Assign a pointer to the shared memory space.
  *ShmPTR = (sharedMemoryStruct *) shmat(*ShmID, NULL, 0);
  if ((long)*ShmPTR == -1) {
    perror("*** shmat error (server) ***\n");
    exit(1);
  }
}

/***************************************************************************
 * A process will invoke this function to detach its shared memory region. 
 ***************************************************************************/
void
detachSharedMemory(sharedMemoryStruct *ShmPTR, char Who[])
{
  shmdt((void *)ShmPTR);
  printf("%s has detached its shared memory...\n", Who);
}

/***************************************************************************
 * A process will invoke this function to remove its shared memory region.
 ***************************************************************************/
void
removeSharedMemory(int ShmID, char Who[])
{
  shmctl(ShmID, IPC_RMID, NULL);
  printf("%s has removed the shared memory region.\n", Who);
}
