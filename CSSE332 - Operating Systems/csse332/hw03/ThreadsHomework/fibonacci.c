/* Enter your code for exercise 4.26 in this file.
 * Be sure to include your name and section number in this document. 
 * You must also provide a Makefile to compile your program. 
Author: Andreas Palsson
Section: 02
*/
 
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <unistd.h>

int size;
int * a;
void * fibonacci(void * nr);
int main (int argc, char *argv[]){
	
	size = atoi(argv[1]);
	a = (int *) malloc(size * sizeof(int));
 	pthread_t tid;
	pthread_attr_t attr;
	pthread_attr_init(&attr);
	if(pthread_create(&tid, &attr, fibonacci, NULL) != 0) {
		printf("PTHREAD CREATE FAILED\n");
	}
	if(pthread_join(tid, NULL) != 0) {
		printf("PTHREAD JOIN FAILED\n");
	}
	int i;
	for(i = 0; i <= size; i++) {
		printf("%d: %d\n", i, a[i]);
	}
	free(a);
	return 0;
}

void * fibonacci(void * nr) {
	int i;
	a[0] = 0; a[1] = 1;
	for(i = 2; i <= size; i++) {
		a[i] = a[i-1] + a[i-2];
	}
	return NULL;
}
