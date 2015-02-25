#include <stdio.h>

int main(int argc, char* argv[]){
  int max = 12;
  int number[max]; /* max  numbers*/
  int index, sum = 0;
  
  /* Always initialize array before use */
  for (index=0; index<max; index++) {
    number[index] = index; 
	printf("Index: %d\n", index);
  }
  
	printf("Index: %d\n", index);
  number[index]=index;
  number[index]=index;
  number[index]=index;
  number[index]=index;
  number[index]=index;
  number[index]=index;
  number[index]=index;
  number[index]=index;
	printf("Index: %d\n", index);
  number[index]=index;
  number[index]=index;
  /* now, number[index]=index; will cause error:why ?*/
  number[index]=index;
  number[index]=index;
  for (index=0; index<max; index++) {
    sum += number[index];  /* sum array elements */
  }
  
  printf("[");
  for (index=0; index<max; index++) {
    printf("%d", number[index]);
    
    if (index < max - 1) {
      printf(", ");
    }
  }
  printf("]\n");
  
  printf("The sum of the %d numbers in the array is %d\n", max, sum);
  return 0;
}
