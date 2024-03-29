import { render } from '@testing-library/react'
import { Clips } from '../../src/components/Clips'
import { Clip } from '../../../shared/types'

const mockClips: Clip[] = [
  {
    clips: [],
    collapsed: false,
    id: 'clipId1',
    index: 0,
    parentId: null,
    title: 'clipName1',
    url: 'clipUrl1',
    userId: 1,
  },
  {
    clips: [],
    collapsed: false,
    id: 'clipId2',
    index: 1,
    parentId: null,
    title: 'clipName2',
    url: 'clipUrl2',
    userId: 1,
  },
]

const testClips: Clip[] = [
  ...mockClips,
  {
    clips: [{ ...mockClips[0] }],
    collapsed: false,
    id: 'id',
    index: 0,
    parentId: null,
    title: 'title',
    url: null,
    userId: 1,
  },
]

describe('<Clips />', () => {
  it('renders', () => {
    const { container } = render(<Clips clips={testClips} />)
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
        list-style-type: none;
        margin: 2rem 0;
        max-width: 1200px;
        padding: 0;
        width: 100%;
      }

      .c0 h2 {
        margin: 8px 0;
        padding: 0;
      }

      .c2 {
        border-radius: 8px;
        border: 1px solid lightgrey;
        padding: 16px;
      }

      .c3 {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      .c1 {
        padding: 4px;
      }

      .c1 a {
        color: black;
        -webkit-text-decoration: none;
        text-decoration: none;
      }

      <div>
        <div
          class="c0"
        >
          <div
            class="c1"
          >
            <a
              href="clipUrl1"
            >
              clipName1
            </a>
          </div>
          <div
            class="c1"
          >
            <a
              href="clipUrl2"
            >
              clipName2
            </a>
          </div>
          <div
            class="c2"
          >
            <h2>
              title
            </h2>
            <div
              class="c3"
            >
              <div
                class="c1"
              >
                <a
                  href="clipUrl1"
                >
                  clipName1
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
  })
})
