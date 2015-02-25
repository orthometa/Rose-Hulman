/*
 * Authors: Andreas Palsson, Andrew Davidson
 * Date: 2014-02-02
*/
#include <time.h>
#include <unistd.h>
#include <semaphore.h>
#include <sys/shm.h>
#include <sys/types.h>
#include <sys/wait.h>
#include "airlinereservation.h"


int main (int argc, char* argv[]){
  /* TODO: Begin implementing your solutions here. */
	if(argc != 3) {
		printf("Usage: %s <number_of_customers> <outfile>\n", argv[0]);
		exit(1);
	}

	int status;
	int number_of_customers = atoi(argv[1]);
	FILE * out = fopen(argv[2], "w");
	fclose(out);

	int ShmID;
	sharedMemoryStruct * ShmPTR;
	ShmID = createSharedMemoryRegion(SH_MEM_KEY);
	ShmPTR = attachSharedMemoryRegion(ShmID);

	printSeatsAvailable(&ShmPTR->plane);
	
	sem_init(&ShmPTR->first_class, 1, 1);
	sem_init(&ShmPTR->coach_class, 1, 1);
	sem_init(&ShmPTR->write_mutex, 1, 1);
	int i;
	pid_t fork_pid;
	for(i = 0; i < number_of_customers; i++) {
		fork_pid = fork();
		if(fork_pid == 0) {
			executeChild(i, argv[2]);
		}
	}

	for(i = 0; i < number_of_customers; i++)
		waitpid(-1, &status, 0);

	printSeatsAvailable(&ShmPTR->plane);
	shmdt((void *) ShmPTR);
	shmctl(ShmID, IPC_RMID, NULL);
  return 0;
}

void executeChild(int i, char * filename) {
	sharedMemoryStruct * ShmPTR;
	locateAndAttachSharedMemory(SH_MEM_KEY, &ShmPTR);
	int booked_seats = 0;
	int n = 0;
	int wants_coach_seating = wantsCoachSeating(i);
	int number_of_seats = getNumberOfSeats(i, wants_coach_seating);
	int * seats = (int *) calloc(number_of_seats, sizeof(int));
	for(n = 0; n < number_of_seats; n++) 
		booked_seats += book(i, ShmPTR, &seats, n, wants_coach_seating);		

	printReceipt(filename, ShmPTR, i, booked_seats, wants_coach_seating, seats);
	free(seats);
	_exit(1);
}

void printReceipt(char * filename, sharedMemoryStruct * ShmPTR, int i, int booked_seats, int wants_coach_seating, int * seats) {

	/* print to console */
	printf("Customer %d. Reserved %d seats.\n", i, booked_seats);

	/* print to file */
	sem_wait(&ShmPTR->write_mutex);
		FILE * outFile = fopen(filename, "a");
		fprintf(outFile, "Customer id: %d,\n", i);
		if(wants_coach_seating)
			fprintf(outFile, "Seats: Coach,\n");
		else
			fprintf(outFile, "Seats: First Class,\n");
		fprintf(outFile, "Number of seats: %d,\n", booked_seats);
		int j;
		fprintf(outFile, "Seats: ");
		for(j = 0; j < booked_seats; j++) 
			fprintf(outFile, "%d, ", seats[j]);
	
		fprintf(outFile, "\n\n");
		fclose(outFile);
	sem_post(&ShmPTR->write_mutex);
}

int book(int i, sharedMemoryStruct * ShmPTR, int ** seats, int n, int wants_coach_seating) {
	int latest_booked_seat;
	wait_for_semaphore(ShmPTR, wants_coach_seating);
		if(!seatsRemaining(&ShmPTR->plane, wants_coach_seating)) {
			post_semaphore(ShmPTR, wants_coach_seating);
			return 0;
		}
		latest_booked_seat = reserveRandomSeat(&ShmPTR->plane, wants_coach_seating);
		(*seats)[n] = latest_booked_seat;
		printf("Customer %d, booked seat %d.\n", i, latest_booked_seat);
		printSeatsAvailable(&ShmPTR->plane);
	post_semaphore(ShmPTR, wants_coach_seating);
	return 1;
}

void wait_for_semaphore(sharedMemoryStruct * ShmPTR, int wants_coach_seating) {
	if(wants_coach_seating)
		sem_wait(&ShmPTR->coach_class);
	else 
		sem_wait(&ShmPTR->first_class);
}

void post_semaphore(sharedMemoryStruct * ShmPTR, int wants_coach_seating) {
	if(wants_coach_seating)
		sem_post(&ShmPTR->coach_class);
	else 
		sem_post(&ShmPTR->first_class);
}

int createSharedMemoryRegion(key_t key) {
	int ShmID = shmget(key, sizeof(sharedMemoryStruct), IPC_CREAT | 0666);
	if(ShmID < 0) {
		perror("*** shmget error ***\n");
		exit(1);
	}
	return ShmID;
}

sharedMemoryStruct * attachSharedMemoryRegion(int ShmID) {
	sharedMemoryStruct * ShmPTR = (sharedMemoryStruct *) shmat(ShmID, NULL, 0);
	if(ShmPTR == NULL) {
		perror("*** shmat error ***\n");
		exit(1);
	}
	return ShmPTR;
}

void locateAndAttachSharedMemory(key_t key, sharedMemoryStruct ** ShmPTR) {

	int ShmID = shmget(key, sizeof(sharedMemoryStruct), 0666);
	if(ShmID < 0) {
		perror("*** shmget error (child) ***\n");
		exit(1);
	}
	*ShmPTR = attachSharedMemoryRegion(ShmID);

	/* *ShmPTR = (sharedMemoryStruct *) shmat(ShmID, NULL, 0);
	if(*ShmPTR == NULL) {
		perror("*** shmat error (child) ***\n");
		exit(1);
	}*/
}
