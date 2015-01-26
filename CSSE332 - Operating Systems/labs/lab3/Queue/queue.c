/* This is the shell you must fill in or replace in order to complete
   this project.  Do not forget to include your name in the initial
   comments in this file.
	Andreas Palsson, Andrew Davidson
*/

#include <stdlib.h>
#include <stdio.h>
#include "queue.h"

void deleteQueue(Queue *Aqueue);
Bool enqueue(Queue *Aqueue, int processId, int arrivalTime, int serviceTime, int remainingTime);
int printQueue(Queue Aqueue);
int queueSize(Queue Aqueue);
Node dequeue(Queue *Aqueue);


void deleteQueue(Queue *Aqueue) {
	Node * temp = Aqueue->head;
	Aqueue->tail = NULL;
	Aqueue->head = NULL;
	if(temp == NULL) {
		return;
	}

	while(temp != NULL) {
		Node * next = temp->next;
		free(temp);
		temp = next;
	}
}

Bool enqueue(Queue *Aqueue, int processId, int arrivalTime, int serviceTime, int remainingTime) {
	Node * node = (Node *) malloc(sizeof(Node));
	node->processId = processId;
	node->arrivalTime = arrivalTime;
	node->serviceTime = serviceTime;
	node->remainingTime = remainingTime;
	node->next = NULL;
	if(Aqueue->tail == NULL) {
		Aqueue->head = node;
		Aqueue->tail = node;
	} 
	else {
		(Aqueue->tail)->next = node;
		Aqueue->tail = node;
	}
	return TRUE;
}

int printQueue(Queue Aqueue) {
	int i = 0;
	Node * temp = Aqueue.head;
	printf("Process id\tArrival Time\tService Time\tRemaining Time\n");	
	while(temp != NULL) {
		i++;
		printf("%d\t\t%d\t\t%d\t\t%d\n", temp->processId, temp->arrivalTime, temp->serviceTime, temp->remainingTime);
		temp = temp->next;
	}
	return i;
}

int queueSize(Queue Aqueue) {
	int i = 0;
	Node * temp = Aqueue.head;
	while(temp != NULL) {
		i++;
		temp = temp->next;
	}
	return i;	
}

Node dequeue(Queue *Aqueue) {
	if(Aqueue->head == NULL) {
		Node * node = (Node *) malloc(sizeof(Node));
		node->processId = -1;
		return (*node);
	}

	if(queueSize(*Aqueue) == 1) {
		Aqueue->tail = NULL;
	}
	Node head = *(Aqueue->head);
	free(Aqueue->head);
	Aqueue->head = Aqueue->head->next;
	return (head);
}
