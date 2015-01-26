/* This is where you implement the core solution.
   by Andreas Palsson, Andrew Davidson
*/


#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <pthread.h>
#include "threads.h"
#include <sys/time.h>
#include <limits.h>
int n;
int index2 = 0;
long int times[MAX_N_SIZE];
long int brute_times[MAX_N_SIZE];
long int bubble_times[MAX_N_SIZE];
long int merge_times[MAX_N_SIZE];
int main(int argc, char * argv[]) {
	if(argc != 4) {
		printf("Usage: ./threads <number_of_threads> <infile> <outfile>\n");
		exit(0);
	}
	n = atoi(argv[1]);
	pid_t threads[n];
	FILE * fileIn = fopen(argv[2], "r");
	
	struct timeval time_created;
	
	int numOfLines = 0;
	int cost;
	int index = 0;
	while(fscanf(fileIn, "%d", &cost) != -1) {
		index = index % n;
		buffer[index][index2] = cost;
		numOfLines++;
		index++;
		if(numOfLines % n == 0)
			index2++;
	}
	
	int i;
	for(i = 0; i < n; i++) {
		pthread_t tid;
		pthread_attr_t attr;
		pthread_attr_init(&attr);
		
		gettimeofday(&time_created, NULL);
		times[i] = time_created.tv_sec * 1000000 + time_created.tv_usec;
		if(n > 3*i) {
			pthread_create(&tid, &attr, brute, (void *) (i));
		}
		else if(2*n > 3*i) {
			pthread_create(&tid, &attr, bubble, (void *)  (i));
		}
		else {
			pthread_create(&tid, &attr, merge, (void *) (i));
		}
		threads[i] = tid;
	}
	for(i = 0; i < n; i++) {
		pthread_join(threads[i], NULL);
		printf("Times[%d]: %ld\n", i, times[i]);
	}
	int brute = 0;
	int bubble = 0;
	int merge = 0;
	int j;
	for(j = 0; j < n; j++) {
		if(n > 3*j) {
			brute_times[brute] = times[j];
			brute++;
		}
		else if(2*n > 3*j) {
			bubble_times[bubble] = times[j];
			bubble++;
		}
		else {
			merge_times[merge] = times[j];
			merge++;
		}
	}
	printf("Average sorting times:\nBruteSort: %d ms\nBubbleSort: %d ms\nMergeSort: %dms\n", get_mean_value(brute_times, brute), get_mean_value(bubble_times, bubble), get_mean_value(merge_times, merge));
	printf("BruteSort max: %ld\nBruteSort min: %ld\n", get_max_value(brute_times, brute), get_min_value(brute_times, brute));
	printf("Bubble max: %ld\nBubble min: %ld\n", get_max_value(bubble_times, bubble), get_min_value(bubble_times, bubble));
	printf("Merge max: %ld\nMerge min: %ld\n", get_max_value(merge_times, merge), get_min_value(merge_times, merge));
	MergeAndOutputBuffer(argv[3]);	
	return 0;

}

long int get_max_value(long int array[], int size) {
	int max = INT_MIN;
	int i;
	for(i = 0; i < size; i++) {
		if(array[i] > max)
			max = array[i];
	}	
	return max;
}

long int get_min_value(long int array[], int size) {
	int min = INT_MAX;
	int i;
	for(i = 0; i < size; i++) {
		if(array[i] < min) 
			min = array[i];
	}
	return min;
}

int get_mean_value(long int array[], int size) {
	long int mean = 0;
	int i;
	for(i = 0; i < size; i++) {
		mean += array[i];
	}
	return mean/size;
}


void * brute(void * arg) {
	int a = (int) arg;
	BruteForceSort(buffer[a], index2);
	struct timeval time_finished;
	gettimeofday(&time_finished, NULL);
	times[a] = time_finished.tv_sec * 1000000 + time_finished.tv_usec - times[a];
	return NULL;
}
void * merge(void * arg) {
	int a = (int) arg;
	MergeSort(buffer[a], 0, index2);
	struct timeval time_finished;
	gettimeofday(&time_finished, NULL);
	times[a] = time_finished.tv_sec * 1000000 + time_finished.tv_usec - times[a];
	return NULL;
}
void * bubble(void * arg) {
	int a = (int) arg;
	BubbleSort(buffer[a], index2);
	struct timeval time_finished;
	gettimeofday(&time_finished, NULL);
	times[a] = time_finished.tv_sec * 1000000 + time_finished.tv_usec - times[a];
	return NULL;
}

/* Uses a brute force method of sorting the input list. */
void BruteForceSort(int inputList[], int inputLength) {
    int i, j, temp;
    for (i = 0; i < inputLength; i++) {
        for (j = i+1; j < inputLength; j++) {
            if (inputList[j] < inputList[i]) {
                temp = inputList[j];
                inputList[j] = inputList[i];
                inputList[i] = temp;
            }
        }
    }
}

/* Uses the bubble sort method of sorting the input list. */
void BubbleSort(int inputList[], int inputLength) {
    char sorted = 0;
    int i, temp;
    while (!sorted) {
        sorted = 1;
        for (i = 1; i < inputLength; i++) {
            if (inputList[i] < inputList[i-1]) {
                sorted = 0;
                temp = inputList[i-1];
                inputList[i-1] = inputList[i];
                inputList[i] = temp;
            }
        }
    }
}

/* Divides an array into halfs to merge together in order. */
void MergeSort(int *array, int left, int right)
{
    int mid = (left+right)/2;
    if(left<right)
    {
        MergeSort(array,left,mid);
        MergeSort(array,mid+1,right);
        Merge(array,left,mid,right);
    }
}

/* Sudo merges two arrays.  Instead of having two arrays as input, it merges positions 
 * in the overall array by reording data.  This saves space. */
void Merge(int *array, int left, int mid, int right)
{
    int tempArray[right-left+1];
    int pos=0,lpos = left,rpos = mid + 1;
    while(lpos <= mid && rpos <= right)
    {
        if(array[lpos] < array[rpos])
        {
            tempArray[pos++] = array[lpos++];
        }
        else
        {
            tempArray[pos++] = array[rpos++];
        }
    }
    while(lpos <= mid)  tempArray[pos++] = array[lpos++];
    while(rpos <= right)tempArray[pos++] = array[rpos++];
    int iter;
    for(iter = 0;iter < pos; iter++)
    {
        array[iter+left] = tempArray[iter];
    }
    return;
}

/* Merges the sorted files into an output file using the two dimensional output 
 * buffer */
void MergeAndOutputBuffer(char* outputFile) {
    FILE *outFile = fopen(outputFile, "w");
    if(outFile == NULL){
        fprintf(stderr, "Unable to open the file %s\n", outputFile);
        exit(2);
    }
    int i;
    long j;
    int indexes[n], maxIndexes[n];
    for (i = 0; i < n; i++) {
        for (j = 0; buffer[i][j] > 0; j++) {
        }
        maxIndexes[i] = j;
        indexes[i] = 0;
    }
    int smallIndex;
    j = 0;
    while(1) {
        smallIndex = -1;
        for (i = 0; i < n; i++) {
            if (indexes[i] < maxIndexes[i]) {
                smallIndex = i;
                break;
            }
        }
        if (smallIndex == -1) {
            break;
        }
        for (i = 1; i < n; i++) {
            if ((indexes[i] < maxIndexes[i]) && (buffer[i][indexes[i]] < buffer[smallIndex][indexes[smallIndex]])) {
                smallIndex = i;
            }
        }
        fprintf(outFile, "%d\n", buffer[smallIndex][indexes[smallIndex]]);
        fflush(outFile);
        indexes[smallIndex]++;
        j++;
    }
    fclose(outFile);
}
