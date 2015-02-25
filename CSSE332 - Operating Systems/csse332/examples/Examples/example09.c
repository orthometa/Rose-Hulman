#include <stdio.h>

/* function prototype at start of file */
int sum(int a, int b);

int main(int argc, char *argv[]){
  int total = sum(4,5); /* call to the function */	
  printf("The sum of 4 and 5 is %d\n", total);
}

/* the function itself arguments passed by value */
int sum(int a, int b){
  return (a+b);      /* return by value */
}
