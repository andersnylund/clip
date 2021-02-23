import { Bookmarks } from 'webextension-polyfill-ts'
import { Clip } from '../../types'

export const mockClips: Clip[] = [
  {
    clips: [{ clips: [], id: '1', index: 0, parentId: 'parentId', title: 'title', url: null, userId: 1 }],
    id: 'parentId',
    index: 0,
    parentId: null,
    title: 'parentTitle',
    url: null,
    userId: 1,
  },
]

export const firefoxRootBookmark: Bookmarks.BookmarkTreeNode = {
  id: 'root________',
  title: '',
  index: 0,
  dateAdded: 1610199885106,
  type: 'folder',
  dateGroupModified: 1613247249892,
  children: [
    {
      id: 'menu________',
      title: 'Bookmarks Menu',
      index: 0,
      dateAdded: 1610199885106,
      type: 'folder',
      parentId: 'root________',
      dateGroupModified: 1610199885567,
      children: [
        {
          id: 'j-Fy4x0Z-5On',
          title: 'Mozilla Firefox',
          index: 0,
          dateAdded: 1610199885567,
          type: 'folder',
          parentId: 'menu________',
          dateGroupModified: 1610199885567,
          children: [
            {
              id: '1-qKGq0uhJ1M',
              title: 'Help and Tutorials',
              index: 0,
              dateAdded: 1610199885567,
              type: 'bookmark',
              url: 'https://support.mozilla.org/en-US/products/firefox',
              parentId: 'j-Fy4x0Z-5On',
            },
            {
              id: 'lXOlsjDx1uuG',
              title: 'Customize Firefox',
              index: 1,
              dateAdded: 1610199885567,
              type: 'bookmark',
              url:
                'https://support.mozilla.org/en-US/kb/customize-firefox-controls-buttons-and-toolbars?utm_source=firefox-browser&utm_medium=default-bookmarks&utm_campaign=customize',
              parentId: 'j-Fy4x0Z-5On',
            },
            {
              id: 'IHCwTHmUx4jm',
              title: 'Get Involved',
              index: 2,
              dateAdded: 1610199885567,
              type: 'bookmark',
              url: 'https://www.mozilla.org/en-US/contribute/',
              parentId: 'j-Fy4x0Z-5On',
            },
            {
              id: 'MuHjkbAlN7lq',
              title: 'About Us',
              index: 3,
              dateAdded: 1610199885567,
              type: 'bookmark',
              url: 'https://www.mozilla.org/en-US/about/',
              parentId: 'j-Fy4x0Z-5On',
            },
          ],
        },
      ],
    },
    {
      id: 'toolbar_____',
      title: 'Bookmarks Toolbar',
      index: 1,
      dateAdded: 1610199885106,
      type: 'folder',
      parentId: 'root________',
      dateGroupModified: 1613247249892,
      children: [
        {
          id: 'r9XXWlPBCuKr',
          title: 'testing',
          index: 0,
          dateAdded: 1610201692275,
          type: 'folder',
          parentId: 'toolbar_____',
          dateGroupModified: 1613242597434,
          children: [
            {
              id: 'BdsM04swGwWH',
              title: 'clip.so – Share your clips',
              index: 0,
              dateAdded: 1610201697594,
              type: 'bookmark',
              url: 'http://localhost:3000/clips',
              parentId: 'r9XXWlPBCuKr',
            },
            {
              id: 'R_El0H_RQrjO',
              title: 'clipception',
              index: 1,
              dateAdded: 1610811412833,
              type: 'folder',
              parentId: 'r9XXWlPBCuKr',
              dateGroupModified: 1613242597434,
              children: [
                {
                  id: 'e6sbm4i5XjLC',
                  title: 'aaargh',
                  index: 0,
                  dateAdded: 1613242587384,
                  type: 'folder',
                  parentId: 'R_El0H_RQrjO',
                  dateGroupModified: 1613242597434,
                  children: [
                    {
                      id: '1C0zEWb_cqVk',
                      title: 'google',
                      index: 0,
                      dateAdded: 1610811425583,
                      type: 'bookmark',
                      url: 'https://google.com/',
                      parentId: 'e6sbm4i5XjLC',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'Z4oGwYBAmnFK',
          title: 'clip.so – Share your clips',
          index: 1,
          dateAdded: 1610201744501,
          type: 'bookmark',
          url: 'http://localhost:3000/clips',
          parentId: 'toolbar_____',
        },
        {
          id: 'YIQzq0nFaoUf',
          title: 'nothing',
          index: 2,
          dateAdded: 1610812338455,
          type: 'folder',
          parentId: 'toolbar_____',
          dateGroupModified: 1610812340098,
          children: [],
        },
        {
          id: 'xRLe8KZfNEEB',
          title: 'testing',
          index: 3,
          dateAdded: 1610812440156,
          type: 'bookmark',
          url: 'http://asdf/',
          parentId: 'toolbar_____',
        },
        {
          id: 'Du6LxlaViYtc',
          title: 'asöldkasöldk',
          index: 4,
          dateAdded: 1613247249892,
          type: 'folder',
          parentId: 'toolbar_____',
          dateGroupModified: 1613247251145,
          children: [],
        },
      ],
    },
    {
      id: 'unfiled_____',
      title: 'Other Bookmarks',
      index: 3,
      dateAdded: 1610199885106,
      type: 'folder',
      parentId: 'root________',
      dateGroupModified: 1611600029779,
      children: [],
    },
    {
      id: 'mobile______',
      title: 'Mobile Bookmarks',
      index: 4,
      dateAdded: 1610199885123,
      type: 'folder',
      parentId: 'root________',
      dateGroupModified: 1610199885550,
      children: [],
    },
  ],
}

export const rootChromeBookmark: Bookmarks.BookmarkTreeNode = {
  children: [
    {
      children: [
        {
          children: [
            {
              dateAdded: 1610811968618,
              id: '8',
              index: 0,
              parentId: '7',
              title: 'google',
              url: 'https://google.com/',
            },
            {
              children: [
                {
                  dateAdded: 1610201629261,
                  id: '5',
                  index: 0,
                  parentId: '9',
                  title: 'clip.so – Share your clips',
                  url: 'http://localhost:3000/clips',
                },
              ],
              dateAdded: 1610811985144,
              dateGroupModified: 1610811993212,
              id: '9',
              index: 1,
              parentId: '7',
              title: 'clipception',
            },
          ],
          dateAdded: 1610811951364,
          dateGroupModified: 1610811985144,
          id: '7',
          index: 0,
          parentId: '1',
          title: 'testing',
        },
        {
          children: [],
          dateAdded: 1610812309150,
          dateGroupModified: 1610812309150,
          id: '10',
          index: 1,
          parentId: '1',
          title: 'nothing',
        },
        {
          children: [],
          dateAdded: 1613247238088,
          dateGroupModified: 1613247238088,
          id: '12',
          index: 2,
          parentId: '1',
          title: 'asöldkaölskd',
        },
      ],
      dateAdded: 1610201376440,
      dateGroupModified: 1613247238089,
      id: '1',
      index: 0,
      parentId: '0',
      title: 'Bookmarks Bar',
    },
    {
      children: [],
      dateAdded: 1610201376440,
      id: '2',
      index: 1,
      parentId: '0',
      title: 'Other Bookmarks',
    },
  ],
  dateAdded: 1613586636601,
  id: '0',
  title: '',
}
