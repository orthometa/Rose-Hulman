/* This is where you implement the core solution.
   by Andreas Palsson, 12/3/2014
*/

#include <stdio.h>
#include <stdlib.h>
#include "inv.h"

int main(int argc, char *argv[]) {
	//insert error checks on argc
	if (argc != 3) {
		printf("Wrong number of arguments.\n");
		exit(1);
	}

	FILE *inFile = fopen(argv[1], "rt");
	FILE *outFile = fopen(argv[2], "w");
	static struct Inventory inv[100];
	int itemNumber;
	int quantity;
	float price;
	int month;
	int year;
	char line[50];
	int i = 0;
	printf("Item Number\t\tQuantity\tPrice\t\tExpiration Date\n");
	while(fgets(line, 50, inFile) != NULL) {
		
		sscanf(line, "%d %d %f %d/%d\n", &itemNumber, &quantity, &price, &month, &year);
		inv[i].itemNumber = itemNumber;
		inv[i].quantity = quantity;
		inv[i].price = price;
		inv[i].expiration.month = month;
		inv[i].expiration.year = year;
		printf("%d\t\t\t%d\t\t%.2f\t\t%d/%d\n", inv[i].itemNumber, inv[i].quantity, inv[i].price, inv[i].expiration.month, inv[i].expiration.year);
		if(inv[i].expiration.year > 2008 || (inv[i].expiration.year == 2008 && inv[i].expiration.month > 10))
		fprintf(outFile, "%d %d %.2f %d/%d\n", inv[i].itemNumber, inv[i].quantity, inv[i].price, inv[i].expiration.month, inv[i].expiration.year);
		i += 1;
	}	
	fclose(inFile);
	fclose(outFile);
	return 0;
}
