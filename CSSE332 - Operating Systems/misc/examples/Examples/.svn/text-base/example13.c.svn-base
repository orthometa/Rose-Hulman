#include <stdio.h>

void DoSomething(int **ptr);

int main(int argc, char *argv[]){
  int *p;
  
  DoSomething(&p);
  printf("%d\n", *p);     /* will this work ? */  
  return 0;
}

/* passed and returned using pointers */
void DoSomething(int **ptr){
  int temp = 5+3;  
  *ptr = &(temp);
}
