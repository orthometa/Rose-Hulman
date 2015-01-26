// Author: Andreas Palsson, Andrew Davidson
// CSSE 332, Winter 2014/15, RHIT

#include <stdio.h>
#include <stdlib.h>
#include "inv.h"

int PopulateArray(struct Inventory ** invPtr, int * totSize,FILE * inFile);
void PrintInventory( struct Inventory invToPrint[], int validSize);
int DeleteExpiredItems( struct Inventory ** invPtr, int * totSize, int validSize);
void SaveArray(struct Inventory inv[], int size, FILE * outFile); 

int main(int argc, char * argv[]){
	if(argc != 3){
		printf("Sorry.  You did not supply the proper number of arguments.  Goodbye!");
		exit(0);
	}

  FILE *inFile= fopen(argv[1], "r");
	if (inFile == NULL) {
		printf("The input file could not be opened or found.");
    exit(1);
  }

	FILE *outFile = fopen(argv[2], "w");
	if (outFile == NULL) {
		printf("The output file could not be opened or found.");
    exit(1);
  }

	int totSize = 2;
	int validSize = 0;
	struct Inventory * myInv = (struct Inventory*) malloc(sizeof(struct Inventory)*totSize);

	validSize = PopulateArray(&myInv, &totSize ,inFile);
	fclose(inFile); 
	PrintInventory(myInv, validSize);
	validSize = DeleteExpiredItems( &myInv, &totSize, validSize);
	PrintInventory(myInv, validSize);
	SaveArray(myInv, totSize, outFile);
	fclose(outFile); 

	return 0;
}

int PopulateArray(struct Inventory ** invPtr, int * totSize,FILE * inFile){
	int index = 0;
	int itemNumber = 0;
	int quantity = 0;
	float price  = 0;
	int month = 0;
	int year = 0;
  while(fscanf(inFile, "%d %d %f %d/%d", &itemNumber, &quantity, &price, &month, &year) != -1 && index<99)
	{

		if(index >= (*totSize)){
			struct Inventory * tempInv = (struct Inventory*) malloc(sizeof(struct Inventory)*2*(*totSize));
			int i;
			for(i = 0; i < *totSize;i++){
				tempInv[i]= ((*invPtr)[i]);
			} 
			free(*invPtr);
			(*invPtr) = tempInv;
			*totSize *= 2;
		}
		((*invPtr)[index]).itemNumber = itemNumber;
		((*invPtr)[index]).quantity = quantity;
		((*invPtr)[index]).price = price;
		((*invPtr)[index]).expiration.month = month;
		((*invPtr)[index]).expiration.year = year;

		index++;
	}

	return index;

}

void PrintInventory(struct Inventory invToPrint[], int validSize){
	printf("\n\nItem Number\tQuantity\tPrice\tExpiration Date\n");
	int i;
	for(i = 0; i < validSize; i++){
	printf("%d\t\t%d\t\t%.2f\t%d/%d\n", invToPrint[i].itemNumber,invToPrint[i].quantity, invToPrint[i].price, invToPrint[i].expiration.month, invToPrint[i].expiration.year);
	}
}




int DeleteExpiredItems( struct Inventory ** invPtr, int * totSize, int validSize){
	int unexpiredCount = 0;
	int i;
	for(i = 0; i < validSize;i++){
		if(((*invPtr)[i]).expiration.year>2004){
			unexpiredCount++;
		}	
	}

	struct Inventory * tempInv = (struct Inventory*) malloc(sizeof(struct Inventory)*(unexpiredCount));

	int enterUnexpCnt = 0;
	for(i = 0; i < validSize;i++){
		if(((*invPtr)[i]).expiration.year>2004){
			tempInv[enterUnexpCnt]= ((*invPtr)[i]);
			enterUnexpCnt++;
		}
	}

	free(*invPtr);
	(*invPtr) = tempInv;
	*totSize = unexpiredCount;

	return unexpiredCount;
}

void SaveArray(struct Inventory inv[], int size, FILE * outFile) {
	int i;
	for(i = 0; i < size; i++) {
		fprintf(outFile, "%d %d %.2f %d/%d\n", inv[i].itemNumber, inv[i].quantity, inv[i].price, inv[i].expiration.month, inv[i].expiration.year);
	}
}


