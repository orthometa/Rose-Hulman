/***************************************************************************
 *
 * PROGRAM  babershopMain.c                                  
 *
 * Written by J.P. Mellor, 3 February 2012
 * 
 ***************************************************************************/

#include "sharedMemory.h"
#include <sys/wait.h>
#include <unistd.h>

int SH_MEM_KEY;

/***************************************************************************
 * The main function forks children for the barbers and customers,
 * waits until they all exit, and then exits itself.
 ***************************************************************************/

int
main(int argc, char *argv[])
{
  int ShmID;
  sharedMemoryStruct* ShmPTR;
  char Who[] = "PARENT";
  int nBarbers;
  int nCustomers;
  char shmid[10], chairs[10];
  pid_t pid;
  int i, nChairs;

  /*
   * Obtain a unique key.
   */
  if (argc  < 4) {
    printf("Insufficient arguments\n\n");
    printf("Usage: ./babershop <shmem id> <num barbers> <num customers> <num chairs>\n");
    exit(EXIT_FAILURE);
  }

  SH_MEM_KEY = atoi(argv[1]);
  sprintf(shmid, "%d", SH_MEM_KEY);
  nBarbers = atoi(argv[2]);
  nCustomers = atoi(argv[3]);
  nChairs = atoi(argv[4]);
  sprintf(chairs, "%d", nChairs);

  /****************************
   * Attach shared memory 
   ****************************/
  getSharedMemory(&ShmID, SH_MEM_KEY, &ShmPTR, TRUE);

  /*****************************
   * Initialize semaphores.
   *****************************/
  ShmPTR->freeSeats = nChairs;
  ShmPTR->done = 0;

	sem_init(&ShmPTR->customerReady, 1, 0);
	sem_init(&ShmPTR->customerDone, 1, 0);
	sem_init(&ShmPTR->barberReady, 1, 0);
	sem_init(&ShmPTR->barberDone, 1, 0);
	sem_init(&ShmPTR->accessSeats, 1, 1);

  /********************************
   * Create the barbers and customers
   ********************************/
            
  // Create barber
	for(i = 0; i < nBarbers; i++) {
  	pid = fork();
  	if (pid < 0) {
 	  	printf("*** fork error (server) ***\n");
 	  	exit(1);
 	 	} else if (pid == 0) {
 	  	char barber[25];
 	  	sprintf(barber, "barber %d", i);
 	  	char *cmd[] = {"barber", shmid, barber, chairs, NULL};
 	  	printf("Spawned %s\n", barber);
 	  	execv("barber", cmd);
 	  	exit(0);
	  }
	}

  // Create customer with a random delay
	for(i = 0; i < nCustomers; i++) {
  	usleep(0+rand()%3);
  	pid = fork();
  	if(pid < 0) {
   	 printf("*** fork error (server) ***\n");
   	 exit(1);
  	} else if(pid == 0) {
   		char customer[25];
   		sprintf(customer, "customer %d", i);
   		char *cmd[] = {"customer", shmid, customer, NULL};
   		printf("Spawned %s\n", customer);
   		execv("customer", cmd);
   		exit(0);
  	}
  }
  /**************************************
   * Wait for all barbers and customers to exit.
   **************************************/

  for (i=0; i<nCustomers; i++) {
    wait(NULL);
  }
  // No more customers
  ShmPTR->done = 1;
  for (i=0; i<nBarbers; i++) {
    // signal the customerReady semaphore in case the barber is already
    // waiting for a customer
    sem_post(&(ShmPTR->customerReady));
    wait(NULL);
  }

  /*************************************/
  /*** Detach shared memory and exit ***/
  /*************************************/

  detachSharedMemory(ShmPTR, Who);
  removeSharedMemory(ShmID, Who);
  printf("Parent exits...\n");
  return 0;
}
