/***************************************************************************
 *
 * PROGRAM  communicatingChildren.c                                  
 *
 * Written by Larry Merkle, January 2005
 * Based on a similar program written by Archana Chidanandan, January 2005
 * 
 * Modified by Archana Chidanandan, April 2005.
 * Refactored by Delvin Defoe, January 13, 2009.
 *
 * Demonstrates:
 * - forking processes (though not overlaying with new images),
 * - waiting for completion of child processes, and
 * - using shared memory.
 *
 * Description:
 * The program creates two child processes. One child process prints
 * "a" followed by "c". The second child process prints "b" followed
 * by "d" to the screen.  The printing should be interleaved such that 
 * the characters are printed to the sceen in alphabetic order.
 * To accomplish this synchronization, the parent process creates a shared
 * memory segment that holds semaphores.
 *
 * Problem statement: 
 * You must use semaphores to synchronize the two child processes such
 * that the output will be "A B C D".  The semaphore functions include
 * sem_wait(), sem_post() and sem_init().
 * 
 * Instructions:
 * 1. You should do this assignment individually.
 * 2. Submit the C files and Makefile to your repository. 
 * 3. To compile the program link with the librt library or the libpthread 
 * library.The former is already done for you in the accompanying Makefile 
 * 
 ***************************************************************************/

#include "communicatingChildren.h"
/*
 Obtain a unique key.
*/
#define SH_MEM_KEY  getuid() 


/***************************************************************************
 *
 * The main function forks two children, waits until the second child exits, 
 * and then exits itself.
 *
 * Write the code to initialize semaphores.
 * Also, modify the parent process code so that the parent will wait for
 * both child processes to complete, before it exits.
 *
 ***************************************************************************/
/*
 * Author: A little bit Andreas Palsson
*/
int main(int argc, char *argv[]){

  int status;
  int ShmID;
  sharedMemoryStruct* ShmPTR;

  pid_t pid1, pid2;

  /****************************/
  /* Create and Attach shared */
  /* memory region            */
  /****************************/
  ShmID = createSharedMemoryRegion(SH_MEM_KEY);
  ShmPTR = attachSharedMemoryRegion(ShmID);

  /*****************************/
  /*** Initialize semaphores ***/
  /*	                       */
  /* Write the code to do this.*/
  /*****************************/
	sem_init(&ShmPTR->s, 1, 1);
	sem_init(&ShmPTR->t, 1, 0);

  /********************************/
  /*** Fork first child process ***/
  /********************************/
            
  printf("Parent is about to fork the first child process...\n");
  pid1 = fork();
  if (pid1 < 0) {
    printf("*** fork error (server) ***\n");
    exit(1);
  } else if (pid1 == 0) { //In the child process
    child1();
  }

  /*********************************/
  /*** Fork second child process ***/
  /*********************************/

  printf("Parent is about to fork the second child process...\n");
  pid2 = fork();
  if (pid2 < 0) {
    printf("*** fork error (server) ***\n");
    exit(1);
  } else if (pid2 == 0) { //In the child process
    child2();
  }

  /**************************************/
  /*** Wait for both children to exit ***/
  /*                                    */
  /* Write the code to do this.         */
  /**************************************/
	int i;
	for(i = 0; i < 2; i++) {
		pid_t child_pid = waitpid(-1, &status, 0);
	}


  /*************************************/
  /*** Detach shared memory and exit ***/
  /*************************************/

  shmdt((void *) ShmPTR);
  printf("Parent has detached its shared memory...\n");
  shmctl(ShmID, IPC_RMID, NULL);
  printf("Parent has removed the shared memory...\n");

  printf("Parent exits...\n");
  exit(0);
}


/***************************************************************************
 *
 * The first child attaches to a block of shared memory, prints "A"
 * followed by "C".  It then detaches the shared memory and exits.
 * 
 * Add the code required to synchronize child1 with child2 using semaphores.
 * 
 ***************************************************************************/

void child1(){
  sharedMemoryStruct *ShmPTR;  //Pointer to shared memory

  printf("First child started\n");

  /****************************/
  /* Locate and Attach shared */
  /* memory region            */
  /****************************/     
  locateAndAttachSharedMemory(SH_MEM_KEY, &ShmPTR);
  
  printf("First child has attached the shared memory...\n");

 /*********************************************************/
 /*** Use semaphores to synchronize child1 and child2. ***/
 /*********************************************************/
	sem_wait(&ShmPTR->s);
  printf("\n\n A \n\n");
	sem_post(&ShmPTR->t);
	sem_wait(&ShmPTR->s);
  printf("\n\n C \n\n");
  sem_post(&ShmPTR->t); 
  /*************************************/
  /*** Detach shared memory and exit ***/
  /*************************************/

  shmdt((void *) ShmPTR);
  printf("First child has detached its shared memory...\n");
  printf("First child exits...\n");
  exit(0);
}


/***************************************************************************
 *
 * The second child attaches to a block of shared memory.  It prints
 * "B" followed by "D".  Finally, it detaches the shared memory,
 * removes it, and then exits.
 *
 * Add the code required to synchronize child2 with child1 using semaphores.
 * 
 ***************************************************************************/

void child2(){

  sharedMemoryStruct *ShmPTR;  //Pointer to shared memory

  printf("Second child started\n");

  /****************************/
  /* Locate and Attach shared */
  /* memory region            */
  /****************************/     
  locateAndAttachSharedMemory(SH_MEM_KEY, &ShmPTR);
  printf("Second child has attached the shared memory...\n");
     
 /*********************************************************/
 /*** Use semaphores to synchronize child1 and child2.  ***/
 /*********************************************************/
	sem_wait(&ShmPTR->t);
  printf("\n\n B \n\n");
	sem_post(&ShmPTR->s);
	sem_wait(&ShmPTR->t);
  printf("\n\n D \n\n");

  /*************************************/
  /*** Detach shared memory and exit ***/
  /*************************************/

  shmdt((void *) ShmPTR);
  printf("Second child has detached its shared memory...\n");
  
  printf("Second child exits...\n");
  exit(0);
}



/***************************************************************************
 * Create a shared memory region to exchange data with the client.
 * The first parameter specifies the key for the shared memory region. 
 * The second parameter specifies the size (in bytes) of the region.
 * The third parameter identifies modes, which indicates how the 
 * shared memory will be created and used -- for reading, writing, or 
 * both. Returns the ID of the shared memory region.
***************************************************************************/
int createSharedMemoryRegion(key_t key){
  int ShmID = shmget(key, sizeof(sharedMemoryStruct), IPC_CREAT | 0666);
  if (ShmID < 0) {
    perror("*** shmget error (server) ***\n");
    exit(1);
  }
  return ShmID;
}


/***************************************************************************
 * Attached shared memory region to address space. If successful, will
 * receive a pointer to the start of the shared memory region. 
***************************************************************************/
sharedMemoryStruct* attachSharedMemoryRegion(int ShmID){
  sharedMemoryStruct *ShmPTR = (sharedMemoryStruct *) shmat(ShmID, NULL, 0);
  if (ShmPTR == NULL) {
    perror("*** shmat error (server) ***\n");
    exit(1);
  }
  return ShmPTR;
}


/***************************************************************************
 * Locate and Attached shared memory region to address space. 
 * If successful, will receive a pointer to the start of the 
 * shared memory region. 
***************************************************************************/
void locateAndAttachSharedMemory(key_t key, sharedMemoryStruct **ShmPTR){
  printf("\n\n\nThe client process is attaching to the shared memory\n");
  
  /* Locate shared memory region. 
   * Returns the ID of the shared memory region.*/
  int ShmID = shmget(key, sizeof(sharedMemoryStruct), 0666);
  if (ShmID < 0) {
    perror("*** shmget error (server) ***\n");
    exit(1);
  }
  
  *ShmPTR = (sharedMemoryStruct *) shmat(ShmID, NULL, 0);
  if ( *ShmPTR == NULL) {
    perror("*** shmat error (client) ***\n");
    exit(1);
  }
}
