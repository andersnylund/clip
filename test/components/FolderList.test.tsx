import { render } from '@testing-library/react'

import { FolderList } from '../../src/components/FolderList'

describe('<FolderList />', () => {
  it('renders', () => {
    const { container } = render(
      <FolderList
        folders={[
          {
            id: 'folderId',
            name: 'folderName',
            clips: [{ id: 'clipId', name: 'clipName', folderId: 'folderId', url: 'clipUrl', userId: 1 }],
          },
        ]}
      />
    )
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
        list-style-type: none;
        margin: 2rem 0;
        padding: 0;
        width: 100%;
      }

      .c1 {
        border-radius: 8px;
        border: 1px solid lightgrey;
        padding: 16px;
      }

      <div>
        <ul
          class="c0"
        >
          <li
            class="c1"
          >
            folderName
          </li>
        </ul>
      </div>
    `)
  })
})
