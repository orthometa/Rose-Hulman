/* This is where you implement the core solution.
   by Andreas Palsson, Andrew Davidson, 
	 1/6/2014
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/time.h>
#include "processes.h"

int main(int argc, char* argv[]) {

	struct timeval parent_time_created;
	gettimeofday(&parent_time_created, NULL);
	struct timeval parent_time_finished;
	int n = atoi(argv[1]);
	int x = atoi(argv[2]);
	int status;
	struct timeval time_created;
	struct timeval time_finished;
	FILE * inFile = fopen(argv[3], "r");
	if(argc != 4) {
		printf("Wrong number of arguments!\n");
	}
	if(inFile == NULL) {
		printf("It messed up");
	}
	struct process * processes = (struct process *) malloc(n * sizeof(struct process));
	pid_t fork_pid;
	int i;
	int index;
	for(i = 0; i < n; i++) {
		gettimeofday(&time_created, NULL);
		processes[i].time_created = time_created;
		fork_pid = fork();
		if(fork_pid == 0) {
			index = i + 1;
			sleep(0.000001 * (n-index) * x);
			inFile = fopen(argv[3], "r");
			int line = 1;
			char read_line[255];
			while(line <= index) {
				if(fscanf(inFile, "%s\n", read_line) == -1) {
					inFile = fopen(argv[3], "r");
				} else 
						line++;
			}
			int j;
			for(j = 0; read_line[j] != '\0'; j++);
			char outFileName[j+6];
			
			int k;
			for(k = 0; k < j - 4; k++) {
				outFileName[k] = read_line[k];
			}
			char fileNameIndex[10];
			sprintf(fileNameIndex, "%d", index);
			outFileName[k] = '_';
			outFileName[k+1] = *fileNameIndex;
			outFileName[k+2] = '_';
			outFileName[k+3] = 'o';
			outFileName[k+4] = 'u';
			outFileName[k+5] = 't';
			outFileName[k+6] = '.';
			outFileName[k+7] = 't';
			outFileName[k+8] = 'x';
			outFileName[k+9] = 't';
			outFileName[k+10] = '\0';
			
			printf("I am a child. My index: %d\n", index);

			char * arg[] = {"./myCopy", read_line, outFileName, NULL};
			if(execv("./myCopy", arg) == -1) {
				printf("Execv failed\n");
			}
			exit(index);
		} else {
			processes[i].index = i+1;
			processes[i].pid = fork_pid;
		}
	}
	int numberOfFinishedChildren;
	for(numberOfFinishedChildren = 0; numberOfFinishedChildren < n; numberOfFinishedChildren++) {	
			pid_t child_pid = waitpid(-1, &status, 0);
			gettimeofday(&time_finished, NULL);

			int j;
			for(j = 0; j < n; j++) {
				if(processes[j].pid == child_pid) {
					processes[j].time_finished = time_finished;
					long int diff = processes[j].time_finished.tv_sec * 1000000 + processes[j].time_finished.tv_usec - (processes[j].time_created.tv_sec * 1000000 + processes[j].time_created.tv_usec);
					printf("Time for process %d = %ld microseconds\n", processes[j].index, diff);
					processes[j].time_finished = time_finished;
				}
			}
	}
	gettimeofday(&parent_time_finished, NULL);
	long int diff = parent_time_finished.tv_sec * 1000000 + parent_time_finished.tv_usec - parent_time_created.tv_sec * 1000000 + parent_time_created.tv_usec;
	printf("This is the parent process. All of the children have finished.\n");
	printf("Time for parent thread from start to end: %ld microseconds\n", diff);
	return 0;
}


