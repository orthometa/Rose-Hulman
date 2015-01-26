
#include <stdio.h>
#include <stdlib.h>

void main(void) {

	int i;
	char c[5] = "game";
	char *cPtr = c;
	printf("cPtr is %u\n", (unsigned int) cPtr);	
	for(i = 0; i<strlen(c); i++) {
		printf("%c\n", *cPtr);
		cPtr++;
	}

	printf("\ncPtr is %u\n", (unsigned int) cPtr);

}
