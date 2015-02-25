/* This is the shell you must fill in or replace in order to complete
   lab 2.  Do not forget to include your name in the initial
   comments of this file.
   Andreas Palsson, Andrew Davidson 12/7/2014
*/

#include <stdlib.h>
#include <string.h>
#include <stdio.h>
void moveCharacterToLast(char* token) {
	char first = token[0];
	memmove(token, token + 1, strlen(token) - 1);
	token[strlen(token) - 1] = first;
}

char * createNewString(char* token) {
	char ay[] = "ay";
	char * new_string =	(char*) malloc(strlen(token) + 2 + 1);
	strcat(new_string, token);
	strcat(new_string, ay);
	new_string[strlen(token) + 2] = '\0';
	return new_string;
}

void removeTrailingNewLine(char* token) {
	if(token[strlen(token) - 1] == '\n')
		token[strlen(token) - 1] = 0;
}

int main(int argc, char* argv[]) {
	char input[128];
	printf("Enter a phrase: \n");
	fgets(input, 128, stdin);
	char * token = strtok(input, " ");
	char * new_string;
	while(token != NULL) {
		removeTrailingNewLine(token);
		moveCharacterToLast(token);
		new_string = createNewString(token);
		printf("%s ", new_string);
		token = strtok(NULL, " ");
		
		free(new_string);
	}
	printf("\n");
	return 0;
}
