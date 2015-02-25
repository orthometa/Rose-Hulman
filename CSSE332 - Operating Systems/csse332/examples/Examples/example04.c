#include <stdio.h>

/* C Preprocessor - substitution on appearance 
                  - like Java final */
#define DANGERLEVEL 5    

int main(int argc, char* argv[]) {
  int level=1;
  
  /* if-then-else statement as in Java */
  if (level<=DANGERLEVEL) { /*replaced by 5*/
    printf("Low on gas!\n");
  }
  else {
    printf("On my way!\n");
  }
  
  return 0;
}
