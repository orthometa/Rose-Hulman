/* ----------------------------------------------------------------- 
 * PROGRAM  client.c                                                 
 * The client process uses a key (shared by the server process) to  
 * access the shared memory region.			             
 * It attaches the shared memory to its own address space and then   
 * modifies some of the values. 
 * ----------------------------------------------------------------- */

#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/stat.h>


typedef struct {
  int int1;
  int int2;
  int int3;
  int int4;
} sharedMemoryStruct;


void locateAndAttachSharedMemory(key_t key, sharedMemoryStruct **ShmPTR);


int main(int argc, char *argv[]){
  sharedMemoryStruct *ShmPTR;        /* Pointer to shared memory space */
  key_t key = atoi(argv[1]);        /* Get shared memory key from server. */
    
     
  locateAndAttachSharedMemory(key, &ShmPTR);
  
  printf("Child has accessed %d   %d %d %d in shared memory...\n",
         ShmPTR->int1, ShmPTR->int2, ShmPTR->int3, ShmPTR->int4);
  
  /* Modify values in the shared memory region. */
  ShmPTR->int2 = 325;
  ShmPTR->int3  = 256;

  /* Detach the shared memory from the process's address space.  */
  shmdt((void *) ShmPTR);
  printf("Client has detached its shared memory...\n\n\n");

  /* Do not release the shared memory space. The server will do that. */
  return 0;
}


void locateAndAttachSharedMemory(key_t key, sharedMemoryStruct **ShmPTR){
  printf("\n\n\nThe client process is attaching to the shared memory\n");
  
  /* Locate shared memory region. 
   * Returns the ID of the shared memory region.*/
  int ShmID = shmget(key, sizeof(sharedMemoryStruct), 0666);
  if (ShmID < 0) {
    perror("*** shmget error (server) ***\n");
    exit(1);
  }
  
  /* Attached shared memory region to address space. If successful, will
   * receive a pointer to the start of the shared memory region. */
  *ShmPTR = (sharedMemoryStruct *) shmat(ShmID, NULL, 0);
  if ( *ShmPTR == NULL) {
    perror("*** shmat error (client) ***\n");
    exit(1);
  }
}
