/* This is where you implement the core solution.
   by Andreas Palsson, Andrew Davidson
*/

#define MAX_BUFFER_SIZE 100000
#define MAX_N_SIZE 100

int buffer[MAX_N_SIZE][MAX_BUFFER_SIZE];

void * brute(void * arg);
void * merge(void * arg);
void * bubble(void * arg);
long int get_max_value(long int array[], int size);
int get_mean_value(long int array[], int size);
long int get_min_value(long int array[], int size);
void BruteForceSort(int inputList[], int inputLength);
void BubbleSort(int inputList[], int inputLength);
void MergeSort(int *array, int left, int right);
void Merge(int *array, int left, int mid, int right);
void MergeAndOutputBuffer(char* outputFile);
