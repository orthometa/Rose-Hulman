#include <stdio.h>

#include "chunk.h"
#include "list.h"
#include "data.h"


extern void
__free_Chunk_List__(List l, ChunkFreeFnType ff)
{
  ListNode ln;
  void *ch;
  
  if (l != NULLLIST) {
    foreach (ln, l) {
      ch = (void *) liGet(ln);
      if (ch != (void *) NULL) {
        (*ff)(ch);
      }
    }
    liFree(l);
  }
}

extern void
__empty_Chunk_List__(List l, ChunkFreeFnType ff)
{
  ListNode ln;
  void *ch;
  
  if (l != NULLLIST) {
    for (ln=liFirst(l); ln!=NULLLISTNODE; ln=liRemAndNext(ln)) {
      ch = (void *) liGet(ln);
      if (ch != (void *) NULL) {
        (*ff)(ch);
      }
    }
  }
}
