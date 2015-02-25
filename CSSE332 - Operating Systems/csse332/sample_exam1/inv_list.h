#include "data.h"

typedef struct Inventory{
  int item;
  int quantity;
  float price;
  struct{
    int month;
    int year;
  } expDate;
} Inventory;

createChunk(Inventory);
