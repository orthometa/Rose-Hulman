#include <stdio.h>

int sumAndInc(int *pa, int *pb, int* pc); 

int main(int argc, char* argv[]){
  int a=4, b=5, c=6;
  int *ptr = &b;
  /* call the function */
  int total = sumAndInc(&a, ptr, &c); 
  printf("The sum of %d and %d is %d and c is %d\n", a, b, total, c);

  return 0;
}

/* pointers as arguments */
int sumAndInc(int *pa, int *pb, int *pc) {
  *pc = *pc+1;  /* return a pointee value; NOT *(pc+1)*/
  return (*pa+*pb);  /* return by value */
}
