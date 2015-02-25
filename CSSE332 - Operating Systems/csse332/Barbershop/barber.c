/***************************************************************************
 * The barber ...
 ***************************************************************************/

#include <time.h>
#include "sharedMemory.h"
#include "utility.h"

/***************************************************************************
 * The main function for a barber
 *
 * The barber should wait for a customer.  When one is available, the
 * barber starts and finnishes cutting hair.  If no more customers
 * are available, the barber takes a nap.
 ***************************************************************************/
int
main(int argc, char *argv[])
{
  int ShmID;
  sharedMemoryStruct* ShmPTR;
  char *Who = argv[2];
  int nChairs = atoi(argv[3]);

  /*
   * Obtain a unique key.
   */
  int SH_MEM_KEY = atoi(argv[1]);

  /****************************/
  /*** Attach shared memory ***/
  /****************************/
  getSharedMemory(&ShmID, SH_MEM_KEY, &ShmPTR, FALSE);
  
  /* 
   * Barber ...
   */

	//i am ready to work
	sem_post(&ShmPTR->barberReady);
  while (!ShmPTR->done) {
    // Wait for a customer
    sem_wait(&(ShmPTR->customerReady));
    // If there are no more customers (i.e. we're really done),
    // clean up and exit
    if (ShmPTR->done) {
      break;
    }
    // Start cutting hair
		sem_wait(&ShmPTR->accessSeats);
    cutHairReady(Who, ShmPTR->freeSeats);
		sem_post(&ShmPTR->accessSeats);
    
		// Finish cutting hair
		sem_wait(&ShmPTR->accessSeats);
    cutHairDone(Who, ShmPTR->freeSeats);
		sem_post(&ShmPTR->accessSeats);

		//tell customer he's done and wait for him to tell me i'm done
		sem_post(&ShmPTR->customerDone);
		sem_wait(&ShmPTR->barberDone);
		

	  sem_wait(&ShmPTR->accessSeats);
	  int freeSeats = ShmPTR->freeSeats;
 		sem_post(&ShmPTR->accessSeats);
	
    // If no customers are waiting, take a nap
    if (freeSeats == nChairs) {
      takeNap(Who);
    }
  }
  /*************************************/
  /*** Detach shared memory and exit ***/
  /*************************************/
  detachSharedMemory(ShmPTR, Who);

  printf("%s exits now...\n", Who);
  return 0;
}
