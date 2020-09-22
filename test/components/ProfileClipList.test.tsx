import { render } from '@testing-library/react'

import { ProfileClipList } from '../../src/components/ProfileClipList'

describe('<ProfileClipList />', () => {
  it('renders', () => {
    const { container } = render(
      <ProfileClipList clips={[{ id: 'id', folderId: 'folderId', name: 'name', url: 'url', userId: 1 }]} />
    )
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        margin: 0;
        padding: 0;
        list-style-type: none;
      }

      .c0 li {
        background-color: white;
        border-radius: 4px;
        border: 1px solid #ddd;
        margin: 8px;
        padding: 8px;
        overflow: hidden;
      }

      .c0 li a {
        -webkit-text-decoration: none;
        text-decoration: none;
        color: black;
      }

      <div>
        <ul
          class="c0"
        >
          <li>
            <a
              href="url"
            >
              name
            </a>
          </li>
        </ul>
      </div>
    `)
  })
})
