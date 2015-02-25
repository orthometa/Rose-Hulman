/* Implement your solution to the File Copy problem here.
   by Andreas Palsson, 12/3/2014
*/

#include <stdio.h>
#include <stdlib.h>

	
int ReadLineFromFile(FILE *file, char buf[512]) {
	int ch;
	int numberOfChars = 0;
	while((ch = fgetc(file)) != EOF && ch != '\n') {
		buf[numberOfChars++] = ch;
	}
	return numberOfChars;
}

void WriteLineToFile(FILE *file, char buf[512], int numberOfChars) {
	int i;
	for(i = 0; i < numberOfChars; i++) {
		fprintf(file, "%c", buf[i]);
	}
	fputs("\n", file);
}
 
int main(int argc, char *argv[]) {
	if (argc != 3) {
		printf("Wrong number of arguments");
		exit(1);
	}
	FILE *inFile = fopen(argv[1], "rt");
	if(inFile == NULL) {
		printf("No inFile\n");
		exit(1);
	}
	FILE *outFile = fopen(argv[2], "w");
	static char buf[512];
	int i;
	for(i = 0; !feof(inFile); i++) {
		int a = ReadLineFromFile(inFile, buf);
		WriteLineToFile(outFile, buf, a);
	}
	return 0;
	
}
