#ifndef LIST_H
#define LIST_H

/*
 * Types. These types are opaque. You can't see these, really...
 *
 */
typedef void (*liRemHook)(void *data);

typedef struct {
    struct _ListNode *first, *last;
    liRemHook remhook;
    } *List;

struct _ListNode {
    struct _ListNode *next, *prev;
    List owner;
    void *userdata;
    };
typedef struct _ListNode *ListNode;

/*
 * Constants
 *
 */
#define	NULLLIST	((List)NULL)
#define	NULLLISTNODE	((ListNode)NULL)

/*
 * Functions
 *
 */
extern ListNode malloc_ln();
extern void free_ln(ListNode ln);
extern List liNew(void);
extern void liFree(List l);
extern ListNode liFirst(List l);
extern ListNode liLast(List l);
extern ListNode liNext(ListNode ln);
extern ListNode liPrevious(ListNode ln);
extern ListNode liAppend(List l, void *userdata);
extern ListNode liPrepend(List l, void *userdata);
extern void liRem(ListNode ln);
extern ListNode liRemAndNext(ListNode ln);
extern void *liGet(ListNode ln);
extern ListNode liIsIn(List l, void *userdata);
extern unsigned int liLen(List l);
extern void liApp(List l1, List l2);
extern liRemHook liSetRemHook(List l, liRemHook hook);
extern ListNode liAdd(List l, void *userdata);
extern void liDoneWithLists();

/*
 * Macros
 *
 */
#define foreach(ln, l) \
        for((ln) = liFirst((l)); (ln) != NULLLISTNODE; (ln) = liNext((ln)))
#define forafter(ln1, ln2) \
        for ((ln1) = liNext(ln2); (ln1) != NULLLISTNODE; (ln1) = liNext((ln1)))

#endif
