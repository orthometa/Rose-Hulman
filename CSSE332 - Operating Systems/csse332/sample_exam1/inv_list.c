#include <stdio.h>
#include <stdlib.h>

#include "inv_list.h"
#include "list.h"

instantiateChunk(Inventory);

int
main(int argc, char *argv[])
{
  FILE *infile = NULL;
  FILE *outfile = NULL;

  List inventory_list = liNew();
  Inventory *inv;
  ListNode ln;

  // quit if an improper number of arguments were given
  if (argc != 3) {
    printf("Input requires 2 file names.\n");
    exit(1);
  }

  // open the input file for reading
  infile = fopen(argv[1], "r");
  if (infile == NULL) {
    printf("Could not open %s for reading.\n", argv[1]);
    exit(1);
  }
  
  // open the output file for writing
  outfile = fopen(argv[2], "w");
  if (outfile == NULL) {
    printf("Could not open %s for writing.\n", argv[2]);
    exit(1);
  }
  
  // read the input file into the inventory array
  while (!feof(infile)) {
    inv = allocChunk(Inventory);
    fscanf(infile, "%d %d %f %d/%d", &(inv->item), &(inv->quantity),
           &(inv->price), &(inv->expDate.month), &(inv->expDate.year));
    liAppend(inventory_list, inv);
  }

  // display the inventory list
  printf("\n  Item  Quantity    Price  Expiration\n");
  foreach(ln, inventory_list) {
    inv = liGet(ln);
    printf("%6d    %6d  %7.2f       %02d/%02d\n", inv->item, inv->quantity,
           inv->price, inv->expDate.month, inv->expDate.year);
  }

  printf("\nRemoving expired entries.\n");
  
  // remove expired items from the inventory list
  for (ln=liFirst(inventory_list); ln!=NULLLISTNODE; ) {
    inv = liGet(ln);
    if (inv->expDate.year < 2005) {
      ln = liRemAndNext(ln);
      freeChunk(Inventory, inv);
    } else {
      ln = liNext(ln);
    }
  }

  // display unexpired items and write them to the output file
  printf("\n  Item  Quantity    Price  Expiration\n");
  foreach(ln, inventory_list) {
    inv = liGet(ln);
    printf("%6d    %6d  %7.2f       %02d/%02d\n", inv->item, inv->quantity,
           inv->price, inv->expDate.month, inv->expDate.year);
    fprintf(outfile, "%6d    %6d  %7.2f       %02d/%02d\n", inv->item,
            inv->quantity, inv->price, inv->expDate.month, inv->expDate.year);
  }
         
  fclose(infile);
  fclose(outfile);

  freeChunkList(Inventory, inventory_list);
  liDoneWithLists();

  return 0;
}
