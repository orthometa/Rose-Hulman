#include <stdio.h>

void Sum_1(int a, int *b);

int main(int argc, char* argv[]){
  int *x,*y;
  int p = 5;
  int q = 6;
  
  x = &p;
  y = &q;
  
  printf("Before: q is %i \n",q);
  printf("Before: y is %u \n",y);
  
  Sum_1(p, y);
  
  printf("After: q is %i \n",q);
  printf("After: y is %u \n",y);
  
  return 0;
}

void Sum_1(int a, int *b){
  int input;
  printf("Enter an integer:");
  scanf("%d", &input);
  
  *b = a + input;
}
