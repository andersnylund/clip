import { render } from '@testing-library/react'

import { ProfileFolderList } from '../../src/components/ProfileFolderList'

jest.mock('../../src/hooks/useProfile', () => ({
  useProfile: jest.fn(() => ({ profile: {} })),
}))

describe('<ProfileFolderList />', () => {
  it('renders', () => {
    const { container } = render(<ProfileFolderList folders={[{ id: 'id', name: 'name', clips: [] }]} />)
    expect(container).toMatchInlineSnapshot(`
      .c4 {
        border-radius: 4px;
        padding: 4px;
        font-size: 18px;
        font-weight: 600;
        border: 1px solid lightgray;
      }

      .c4:focus {
        outline: 2px solid gray;
      }

      .c5 {
        background-color: white;
        border: 0;
        padding: 8px;
        -webkit-transition: 0.2s;
        transition: 0.2s;
        border-radius: 4px;
        background-color: white;
      }

      .c5:hover {
        background: lightgray;
        cursor: pointer;
      }

      .c2 {
        margin: 0;
        padding: 0;
        list-style-type: none;
      }

      .c2 li {
        background-color: white;
        border-radius: 4px;
        border: 1px solid #ddd;
        margin: 8px;
        padding: 8px;
        overflow: hidden;
      }

      .c2 li a {
        -webkit-text-decoration: none;
        text-decoration: none;
        color: black;
      }

      .c1 {
        border-radius: 8px;
        border: 1px solid lightgrey;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        padding: 16px;
        background-color: #eee;
      }

      .c1 .c3 {
        margin: 8px 0;
      }

      .c0 {
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
        list-style-type: none;
        margin: 2rem 0;
        padding: 0;
        width: 100%;
      }

      <div>
        <ul
          class="c0"
        >
          <li
            class="c1"
          >
            <p>
              name
            </p>
            <ul
              class="c2"
            />
            <input
              class="c3 c4"
              placeholder="Clip url"
              type="text"
              value=""
            />
            <button
              class="c5"
            >
              +
               
              <span
                aria-label="clip"
                role="img"
              >
                📎
              </span>
            </button>
          </li>
        </ul>
      </div>
    `)
  })
})
