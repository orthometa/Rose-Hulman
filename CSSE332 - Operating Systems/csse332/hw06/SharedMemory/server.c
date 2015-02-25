/* ----------------------------------------------------------------- 
 * PROGRAM  server.c                                              
 * The main function serves as the server that creates a shared      
 * memory of four integers, attaches the shared memory to its own    
 * address space, fills it with the numbers from command line, forks 
 * a client, waits until its client completes, detaches the shared   
 * memory, removes the shared memory, and finally exits.             
 *								     
 * The client process is overlaid with the image of another process  
 * that uses the common key to get the shared memory region. It then  
 * attaches the shared memory space to its own address space, 
 * accesses values in the space, and modifies the values as needed.
 * The parent process (server) and a child process (client) can thus 
 * communicate with each other using the shared memory space.        
 *								     
 * For this program to run successfully, an executible called "client"
 * must exist in the same directory as this program.		     
 * ----------------------------------------------------------------- */

#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <string.h>
#include <unistd.h>
#include <sys/stat.h>


typedef struct {
  int int1;
  int int2;
  int int3;
  int int4;
} sharedMemoryStruct;


int createSharedMemoryRegion(key_t key);

sharedMemoryStruct* attachSharedMemoryRegion(int ShmID);


int main(int argc, char *argv[]){
  int ShmID;                        /* ID to shared memory */
  sharedMemoryStruct *ShmPTR;       /* Pointer to shared memory region */
  pid_t pid;
  int status;
  key_t key = 1005;                 /* Common key to shared memory region.*/
     
  /* Accept the four input numbers that will be stored in the 
   * shared memory region. */
  if (argc < 5) {
    printf("Use: %s #1 #2 #3 #4\n", argv[0]);
    exit(1);
  }
  
  /* Create and attach to address space a shared memory space for 4 integers.*/
  ShmID = createSharedMemoryRegion(key);
  ShmPTR = attachSharedMemoryRegion(ShmID);
     
  /* Write the input values to the shared memory region. */
  ShmPTR->int1 = atoi(argv[1]);
  ShmPTR->int2 = atoi(argv[2]);
  ShmPTR->int3 = atoi(argv[3]);
  ShmPTR->int4 = atoi(argv[4]);
  printf("Server has filled %d %d %d %d in shared memory...\n",
         ShmPTR->int1, ShmPTR->int2, ShmPTR->int3, ShmPTR->int4);
  
  printf("Server is about to fork a child process...\n");
  pid = fork();
  if (pid < 0) {
    printf("*** fork error (server) ***\n");
    exit(1);
  } else if (pid == 0) { /* In the child process */
    /* Overlay the image of the child process with that of "client". */
    char shm_key[32];
    sprintf(shm_key, "%d", key);
    execlp("./client","client",shm_key,NULL);
    exit(0);
  }
          
  wait(&status);        /* Parent wait for child process to complete. */
  printf("Server has detected the completion of its child...\n");
  printf("Server reads %d %d %d %d from shared memory...\n",
         ShmPTR->int1, ShmPTR->int2, ShmPTR->int3, ShmPTR->int4);
  shmdt((void *) ShmPTR);
  printf("Server has detached its shared memory...\n");
  shmctl(ShmID, IPC_RMID, NULL);
  printf("Server has removed its shared memory...\n");
  printf("Server exits...\n");
  
  return 0;
}


int createSharedMemoryRegion(key_t key){
  /* Create a shared memory region to exchange data with the client.
   * The first parameter specifies the key for the shared memory region. 
   * The second parameter specifies the size (in bytes) of the region.
   * The third parameter identifies modes, which indicates how the 
   * shared memory will be created and used -- for reading, writing, or 
   * both. Returns the ID of the shared memory region.
   */
  int ShmID = shmget(key, sizeof(sharedMemoryStruct), IPC_CREAT | 0666);
  if (ShmID < 0) {
    perror("*** shmget error (server) ***\n");
    exit(1);
  }
  return ShmID;
}

sharedMemoryStruct* attachSharedMemoryRegion(int ShmID){
  /* Attached shared memory region to address space. If successful, will
   * receive a pointer to the start of the shared memory region. */
  sharedMemoryStruct *ShmPTR = (sharedMemoryStruct *) shmat(ShmID, NULL, 0);
  if (ShmPTR == NULL) {
    perror("*** shmat error (server) ***\n");
    exit(1);
  }
  return ShmPTR;
}
