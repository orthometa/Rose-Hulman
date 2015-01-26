#include "list.h"
#include "chunk.h"

#include <stdlib.h>

/*
 * This module uses the Chunk service to allocate and free ListNodes
 * efficiently.
 */

static Chunk lnChunk = NULLCHUNK;

List
liNew()
{
  List newList;

  if ((newList = (List)malloc(sizeof(* newList))) == NULL) {
    return(NULLLIST);
  }
  newList->first = newList->last = NULLLISTNODE;
  newList->remhook = (liRemHook) NULL;
  return(newList);
}

void
liFree(List l)
{
  ListNode ln, nextln;

  /* Free all the ListNodes this list owns */
  for (ln = l->first; ln != NULLLISTNODE; ln = nextln) {

    nextln = ln->next;

    if (ln->owner->remhook) {            /* call the rem-hook */
      ln->owner->remhook(ln->userdata);
    }

    free_ln(ln);
  }

  /* and the List structure itself */
  free((void *)l);
}

ListNode
liFirst(List l)
{
  return(l->first);
}

ListNode
liNext(ListNode ln)
{
  return(ln->next);
}

ListNode
liPrevious(ListNode ln)
{
  return(ln->prev);
}

ListNode
liLast(List l)
{
  return(l->last);
}

ListNode
liPrepend(List l, void *userdata)
{
  ListNode newln;

  /* Get a new ListNode */
  if ((newln = malloc_ln()) == NULL) {
    return(NULLLISTNODE);
  }

  /* and fill it out */
  newln->next = l->first;
  newln->prev = NULLLISTNODE;
  newln->owner = l;
  newln->userdata = userdata;

  /* Hook it in */
  if (l->first != NULLLISTNODE) {
    l->first->prev = newln;
    l->first = newln;
  }
  else {
    l->first = l->last = newln;
  }

  return(newln);
}

ListNode
liAppend(List l, void *userdata)
{
  ListNode newln;

  /* Get a new ListNode */
  if ((newln = malloc_ln()) == NULL) {
    return(NULLLISTNODE);
  }

 
  /* and fill it out */
  newln->next = NULLLISTNODE;
  newln->prev = l->last;
  newln->owner = l;
  newln->userdata = userdata;

  /* Hook it in */
  if (l->last != NULLLISTNODE) {
    l->last->next = newln;
    l->last = newln;
  }
  else {
    l->first = l->last = newln;
  }

  return(newln);
}

ListNode
liAdd(List l, void *userdata)
{
 return liAppend(l, userdata);
}

void
liRem(ListNode ln)
{
	if(ln->owner->last == ln) {
		ln->owner->last = ln->prev;
	} 
	else if(ln->owner->first == ln) {
		ln->owner->first = ln->next;
	} else {
		(ln->prev)->next = ln->next;
		(ln->next)->prev = ln->prev;
	}
}

ListNode
liRemAndNext(ListNode ln)
{
  ListNode nextln;

  nextln = ln->next;
  liRem(ln);
  return(nextln);
}

void *
liGet(ListNode ln)
{
  return(ln->userdata);
}

ListNode
liIsIn(List l, void *userdata)
{
  ListNode ln;

  for (ln = l->first; ln != NULLLISTNODE; ln = ln->next) {
    if (ln->userdata == userdata) {
      return(ln);
    }
  }
  return(NULLLISTNODE);
}

unsigned int
liLen(List l)
{
  unsigned int count = 0;
  ListNode ln;

  for (ln = l->first; ln != NULLLISTNODE; ln = ln->next) {
    count++;
  }

  return(count);
}

void
liApp(List l1, List l2)
{
  ListNode ln;

  /* Patch up the owners from l2 */
  for (ln = l2->first; ln != NULLLISTNODE; ln = ln->next) {
    ln->owner = l1;
  }

  /* and hook l2 onto the end of l1 */
  if (l1->last != NULLLISTNODE) {

    l1->last->next = l2->first;
    if (l2->first != NULLLISTNODE) {
      l2->first->prev = l1->last;
      l1->last = l2->last;
    }
  }
  else {
    l1->last = l2->last;
    l1->first = l2->first;
  }

  /* The List l2 is now no longer valid. */
  free((void *)l2);

  return;
}


liRemHook
liSetRemHook(List l, liRemHook hook)
{
  liRemHook prev;

  prev = l->remhook;
  l->remhook = hook;
  return prev;
}


/*
 * This routine gets a chunk of memory suitable for use as a ListNode.
 */
ListNode
malloc_ln()
{
  ListNode ln;

  /* Allocate the Chunk if it hasn't been already */
  if (lnChunk == NULLCHUNK) {
    lnChunk = chNew(sizeof(*ln));
    if (lnChunk == NULLCHUNK) {
      return(NULLLISTNODE);
    }
  }

  ln = (ListNode)chAlloc(lnChunk);

  return(ln);
}

/*
 * This routine gets rid of a ListNode, previously allocated through
 * malloc_ln.
 */
void
free_ln(ListNode ln)
{
  chFree(lnChunk, (void *)ln);

  return;
}


void
liDoneWithLists()
{
  chDelete(lnChunk, chNoCheck);
  lnChunk = NULLCHUNK;
}
