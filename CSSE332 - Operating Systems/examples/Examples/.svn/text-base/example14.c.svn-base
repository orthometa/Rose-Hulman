#include <stdio.h>

void init_array( int array[], int size ) ;

int main(int argc, char *argv[]){
  int list[5];
  int i;
  
  init_array(list, 5);
  for (i = 0; i < 5; i++) {
    printf("next:%d\n", list[i]);
  }

  return 0;
}

/* why size ? */
void init_array(int * array, int size) {
  /* arrays ALWAYS passed as pointers */
  int i;
  
  for (i = 0; i < size; i++) {
    array[i] = i;
  }
}
