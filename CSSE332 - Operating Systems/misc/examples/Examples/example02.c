#include <stdio.h> 

#define STRING1 "A macro definition\n" 
#define STRING2 "must be all on one line!\n" 
#define EXPRESSION1 1 + 2 + 3 + 4 
#define EXPRESSION2 EXPRESSION1 + 10 
#define ABS(x) ((x) < 0) ? -(x) : (x) 
#define MAX(a,b) (a < b) ? (b) : (a) 

/* The ternary operator */
#define BIGGEST(a,b,c) (MAX(a,b) < c) ? (c) : (MAX(a,b)) 

int main (){ 
  printf(STRING1); 
  printf(STRING2); 
  printf("%d\n", EXPRESSION1); 
  printf("%d\n", EXPRESSION2); 
  printf("%d\n", ABS(-5));
  printf("Biggest of 1, 2, and 3 is %d\n", BIGGEST(1,2,3));   
  
  return 0;
} 
