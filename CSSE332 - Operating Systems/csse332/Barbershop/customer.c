/***************************************************************************
 * The customer ...
 ***************************************************************************/

#include <time.h>
#include "sharedMemory.h"
#include "utility.h"

/***************************************************************************
 * The main function for a customer
 *
 * The customer should check to see if there are any empty seets in
 * the barber shop's waiting room.  If there are empty seats, the
 * customer takes a seat and waits to be called by a barber.  If there
 * are no epty seats, the customer leaves the shop and exits.  When a
 * barber calls, the customer gets his hair cut.  When the barber is
 * finished, the customer exits.
 ***************************************************************************/
int
main(int argc, char *argv[])
{
  int ShmID;
  sharedMemoryStruct* ShmPTR;
  char *Who = argv[2];
  
  /*
   * Obtain a unique key.
   */
  int SH_MEM_KEY = atoi(argv[1]);

  /****************************/
  /*** Attach shared memory ***/
  /****************************/
  getSharedMemory(&ShmID, SH_MEM_KEY, &ShmPTR, FALSE);

  /* 
   * Customer ...
   */
  // Check to see if there is an empty seat
	sem_wait(&ShmPTR->accessSeats);
	int freeSeats = ShmPTR->freeSeats;
	sem_post(&ShmPTR->accessSeats);

  if (freeSeats > 0) {
	
    // If there is, take it
		sem_wait(&ShmPTR->accessSeats);
    takeSeat(Who, --ShmPTR->freeSeats);
		sem_post(&ShmPTR->accessSeats);

		//i am ready to get my hair cut 
		sem_post(&ShmPTR->customerReady);
		

		//wait until a barber is ready
		sem_wait(&ShmPTR->barberReady); 
	 
		 // When called by the barber, get hair cut
		sem_wait(&ShmPTR->accessSeats);
    getHaircut(Who, ++ShmPTR->freeSeats);
		sem_post(&ShmPTR->accessSeats);
		
	  // Exit when done
		//wait for barber to tell me i'm done and then tell him he's done too
		sem_wait(&ShmPTR->customerDone); 
		sem_post(&ShmPTR->barberDone);

		//let the barber go back to work
		sem_post(&ShmPTR->barberReady); 
  } else {
    // If not seats, leave shop
    leaveBarbershop(Who);
  }

  /*************************************/
  /*** Detach shared memory and exit ***/
  /*************************************/
  
  detachSharedMemory(ShmPTR, Who);

  printf("%s exits now...\n", Who);
  return 0;
}
