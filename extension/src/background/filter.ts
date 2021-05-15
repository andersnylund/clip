import { Bookmarks } from 'webextension-polyfill-ts'

/**
 * Filters out separators from the complete tree of bookmarks. Separators are a firefox only feature
 * @param bookmark The bookmark which children to filter recursively
 * @returns a bookmark without separators as children
 */
export const filterBookmark = (bookmark?: Bookmarks.BookmarkTreeNode): Bookmarks.BookmarkTreeNode | undefined => {
  if (bookmark?.children) {
    const asdf = bookmark.children
      .filter((child) => child.type !== 'separator')
      .map(filterBookmark)
      .filter((child?: Bookmarks.BookmarkTreeNode): child is Bookmarks.BookmarkTreeNode => child !== undefined)
    return {
      ...bookmark,
      children: asdf,
    }
  } else {
    return bookmark
  }
}
