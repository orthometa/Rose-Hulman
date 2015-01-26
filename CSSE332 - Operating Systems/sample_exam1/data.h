#include "list.h"
#include "chunk.h"


typedef void (*ChunkFreeFnType)(void *);


#define allocChunk(type)                        \
  alloc ## type ## Chunk()
#define freeChunk(type, ptr)                    \
  free ## type ## Chunk((ptr))
#define doneChunk(type, check)                  \
  chDelete(type ## Chunk, check)
#define freeChunkList(type, list)                                       \
  __free_Chunk_List__((list), (ChunkFreeFnType) free ## type ## Chunk)
#define emptyChunkList(type, list)                                     \
  __empty_Chunk_List__((list), (ChunkFreeFnType) free ## type ## Chunk)

extern void __free_Chunk_List__(List l, ChunkFreeFnType ff);
extern void __empty_Chunk_List__(List l, ChunkFreeFnType ff);

#define createChunk(type)                       \
  extern Chunk type ## Chunk;                   \
  extern type *alloc ## type ## Chunk();        \
  extern void free ## type ## Chunk(type *ptr)

#define instantiateChunk(type)                       \
  type *                                             \
  alloc ## type ## Chunk()                           \
  {                                                  \
    if (type ## Chunk == NULLCHUNK) {                \
      type ## Chunk = chNew(sizeof(type));           \
      if (type ## Chunk == NULLCHUNK) {              \
        return (type *) NULL;                        \
      }                                              \
    }                                                \
    return (type *) chAlloc(type ## Chunk);          \
  }                                                  \
                                                     \
  void                                               \
  free ## type ## Chunk(type *ptr)                   \
  {                                                  \
    chFree(type ## Chunk, (void *) ptr);             \
  }                                                  \
                                                     \
  Chunk type ## Chunk = NULLCHUNK
