#include <stdlib.h>
#include <stdio.h>

#include "chunk.h"

/* How many objects to allocate at once */
#define	DEFAULT_QUANTUM	2

Chunk
chNew(unsigned size)
{
  return chNewQ(size, DEFAULT_QUANTUM);
}

Chunk
chNewQ(unsigned size, unsigned quant)
{
  Chunk c;

  c = (Chunk)malloc(sizeof(*c));
  if (c == (Chunk)NULL) {
    return(NULLCHUNK);
  }

  /* We don't allocate any storage at all initially */
  c->freelist = (struct chunkBit *)NULL;
  c->blobs    = (chunkBlob *) NULL;
  c->quantum  = (quant <= 1) ? DEFAULT_QUANTUM : quant;
  
  /*
   * We put freelist pointers in the empty bits. We need to ensure that
   * both pointers and the things we're allocating are aligned properly,
   * and that there's enough space for either.
   *
   * If alignment rules are *really* strange, this could break: should be
   * LCM of the sizes; this will typically work though.
   *
   */

  c->size = sizeof(struct chunkBit);
  if (size > c->size) {
    c->size = size;
  }
  if (c->size % sizeof(struct chunkBit) != 0) { /* Round it up */
    c->size += sizeof(struct chunkBit) - (c->size % sizeof(struct chunkBit));
  }

  return(c);
}

void *
chAlloc(Chunk c)
{
  void *p;
  char *q;
  int i;

  if (c->freelist) {
    /*
     * If there is a free element, grab it and return.
     * This should be the common case, and so be simple and fast.
     *
     */
    p = (void *)c->freelist;
    c->freelist = c->freelist->next;
    return(p);
  }
  else {                                     /* Allocate a blob */
    chunkBlob *blob;
    
    p = malloc(c->size * c->quantum + sizeof(chunkBlob));
    if (p == (void *)NULL) {
      return((void *)NULL);
    }

    /* add to bloblist */
    blob = (chunkBlob *) (((char *)p) + c->size * c->quantum);
    blob->next = c->blobs;
    blob->blob = (void *) p;
    c->blobs = blob;
    
    /* Thread the list through it */
    for (i = 0, q = (char *)p; i < c->quantum - 1; i++, q += c->size) {
      ((struct chunkBit *)q)->next = (struct chunkBit *)(q + c->size);
    }
    /* Terminate the list */
    ((struct chunkBit *)q)->next = (struct chunkBit *)NULL;

    /* Point the freelist at the second element */
    c->freelist = (struct chunkBit *)(((char *)p) + c->size);
    /* and return the first */
    return(p);
  }
}

void
chFree(Chunk c, void *p)
{

  ((struct chunkBit *)p)->next = c->freelist;
  c->freelist = (struct chunkBit *)p;
}

void
chDelete(Chunk c, chCheckType check)
{
  unsigned quant;
  chunkBlob *blobs, *blp;
  unsigned size;
  struct chunkBit *freep, *fcp;

  if (c == NULLCHUNK)
    return ;

  size  = c->size;
  freep = c->freelist;
  blobs = c->blobs;
  quant = c->quantum;
  c->quantum = 0;                            /* mark deleted */

  if (check == chNoCheck) {
  }
  else if (check == chFastCheck  ||
	   size < sizeof(struct chunkBit *) + sizeof(int)) {
    int nblobs, nchunks, mismatch;

    for (nblobs = 0, blp = blobs; blp != NULL; nblobs++, blp = blp->next);

    for (nchunks = 0, fcp = freep; fcp != NULL; nchunks++, fcp = fcp->next);

    mismatch = nblobs * quant - nchunks;

    if (mismatch != 0) {
      printf("mismatch in chDelete() for chunk %p: %d %s chunks",
              c, abs(mismatch), mismatch > 0 ? "unfreed" : "too many");
    }
  }
  else {
    int unfreed = 0, mulfreed = 0, notfound = 0;
    int i, j, nf, *nfp;
    char *q;
    int nblobs;

    for (nblobs = 0, blp = blobs; blp != NULL; nblobs++, blp = blp->next);

    for (blp = blobs; blp != NULL; blp = blp->next) {
      for (q = (char *) blp->blob, i = 0; i < quant; i++, q += size) {
        *((int *) (q + sizeof(struct chunkBit *))) = 0;
      }
    }

    if (check == chReport) {
      fprintf(stderr,
	      "Reporting for chunk %p:  %d chunks allocated (%d blobs)\n",
              c, nblobs*quant, nblobs);
    }
      
    for (fcp = freep; fcp != NULL; fcp = fcp->next) {
      for (blp = blobs; blp != NULL; blp = blp->next) {
        if ((char *) fcp >= (char *) blp->blob  &&
            (char *) fcp <  (char *) blp->blob + size*quant) {
          nfp = (int *) (((char *) fcp) + sizeof(struct chunkBit *));
          if (*nfp >= 1)                     /* loop */
            fcp->next = NULL;
          (*nfp)++;
          goto next_chunk;
        }
      }

      notfound++;
      if (check == chReport) {
        fprintf(stderr,
		"memory at %p was not allocated for chunk %p\n", fcp, c);
      }

    next_chunk:;
    }

    for (j = 0, blp = blobs; blp != NULL; j++, blp = blp->next) {
      for (q = (char *) blp->blob, i = 0; i < quant; i++, q += size) {
        nf = *((int *) (q + sizeof(struct chunkBit *)));
        if (nf == 0) {
          unfreed++;
          if (check == chReport) {
            fprintf(stderr,
		    "chunk number %d of blob %d of chunk %p not freed\n",
                    i, nblobs - j - 1, c);
          }
        }
        else if (nf > 1) {
          mulfreed++;
          if (check == chReport) {
            fprintf(stderr,
		    "chunk number %d of blob %d of chunk %p freed %d times\n",
                    i, nblobs - j - 1, c, nf);
          }
        }
      }
    }

    if (check == chReport) {
      fprintf(stderr, "\n\n");
    }

    if (unfreed > 0  ||  mulfreed > 0  ||  notfound > 0) {
      printf("chunk allocation error in chDelete() for chunk %p: "
              "%d unfreed, %d multiply freed, and %d not found",
              c, unfreed, mulfreed, notfound);
    }
  }
  
  for ( ; blobs != NULL; blobs = blp) {
    blp = blobs->next;
    free((void *) blobs->blob);
  }
  free((void *) c);
}

