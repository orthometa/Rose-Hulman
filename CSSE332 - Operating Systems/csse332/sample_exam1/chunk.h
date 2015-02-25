#ifndef CHUNK_H
#define CHUNK_H

/*
 * Types. These types are opaque. You can't see these, really...
 *
 */
typedef struct chunkBlob {
  struct chunkBlob *next;
  void *blob;
} chunkBlob;

typedef struct {
  struct chunkBit *freelist;
  unsigned size;
  chunkBlob *blobs;
  unsigned quantum;         /* set to zero if chunk is deleted */
} *Chunk;

struct chunkBit {
  struct chunkBit *next;
};

typedef enum { chNoCheck, chFastCheck, chFullCheck, chReport } chCheckType;

/*
 * Constants
 *
 */
#define	NULLCHUNK	((Chunk)NULL)

/*
 * Functions
 *
 */
extern Chunk chNew(unsigned size);
extern Chunk chNewQ(unsigned size, unsigned quantum);
extern void *chAlloc(Chunk c);
extern void chFree(Chunk c, void *p);
extern void chDelete(Chunk c, chCheckType check);
                     
#endif
