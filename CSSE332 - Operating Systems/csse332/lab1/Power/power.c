/* This is the shell you must fill in or replace in order to complete
   this project.  Do not forget to include your name in the initial
   comments of this file.

Author: Andreas Palsson
*/
#include <stdio.h>
#include <math.h> 

float power(float x, int y) {
	if(y == 0)
		return 1;
	
	float res = 1;
	int i;

	if(y < 0) {
		for(i = 0; i > y; i--) {
			res /= x;
		}
		return res;
	}
	for(i = 0; i < y; i++) {
		res *= x;
	}
	return res;	
}
int main(void) {
    int y;
    float x;
	float result = 1;
    printf("Please enter an integer: ");
    scanf("%d", &y);
    printf("Please enter a floating point number: ");
	scanf("%f", &x);
	printf("y: %d, x: %.2f\n", y, x);
	result = power(x, y);
	printf("Result: %.2f\n", result);
	
	printf("The pow function gives us: %.2f\n", pow(x,y));
	return 0;
}

