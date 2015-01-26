

#include <stdio.h>
#include <stdlib.h>
#define SIZE 4
void main(void) {

	int i;
	int c[SIZE] = {0,1,2,3};
	int *cPtr = c;
	printf("c is %u\n", (unsigned int) c);
	printf("cPtr is %u\n", (unsigned int) cPtr);	
	for(i = 0; i<SIZE; i++) {
		printf("%d\n", *cPtr);
		cPtr++;
	}

	printf("\ncPtr is %u\n", (unsigned int) cPtr);

}
