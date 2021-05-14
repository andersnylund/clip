import { Bookmarks } from 'webextension-polyfill-ts'

export const filterBookmark = (bookmark?: Bookmarks.BookmarkTreeNode): Bookmarks.BookmarkTreeNode | undefined =>
  bookmark
    ? {
        ...bookmark,
        children: bookmark.children?.filter((child) => child.type !== 'separator'),
      }
    : bookmark
