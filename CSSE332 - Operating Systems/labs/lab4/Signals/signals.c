/* Andreas Palsson, Andrew Davidson
 * 2015-01-11
*/
#include <signal.h>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include "signals.h"

char * name;

int main(int argc, char * argv[]) {
	name = argv[1];
	printf("> \n");
	signal(SIGINT, intHandler);
	signal(SIGALRM, alrmHandler);
	signal(SIGQUIT, psHandler);
	signal(SIGUSR1, killHandler);
	alarm(5);
	while(1);
	return 0;
}

void killHandler() {
	pid_t fork_pid = fork();
	if(fork_pid == 0) {
		char pid[255];
		printf("Enter a pid to kill\n");
		scanf("%s", pid);
		char * arg[] = {"/bin/kill", pid, NULL};
		execv("/bin/kill", arg);
	}
}	

void intHandler() {
	printf("HANDLED\n");
}

void alrmHandler() {
	printf("Alarm handler\n");
	alarm(5);
}

void psHandler() {
	char * arg[] = {"/bin/ps", "-u", name, NULL};
	pid_t fork_pid = fork();
	if(fork_pid == 0) {
		execv("/bin/ps", arg);
	}
}
