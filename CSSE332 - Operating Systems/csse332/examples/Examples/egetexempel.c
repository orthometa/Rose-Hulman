#include <stdio.h>      //#include myheader.h

int main(int argc, char* argv[]) {
	/* print out a message */
  
	char name[] = {'A','l','e','x',\0,'a','n','d','e','r'};
	printf("The length of string %s is %zu\n", name, strlen(name));
  		
  	return 0;
	}
