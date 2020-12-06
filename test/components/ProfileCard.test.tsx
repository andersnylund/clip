import { render } from '@testing-library/react'

import { ProfileCard } from '../../src/components/ProfileCard'

describe('<ProfileCard />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <ProfileCard user={{ id: 1, folders: [], image: 'imageUrl', name: 'name', username: 'username' }} />
    )
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: grid;
        grid-gap: 16px;
        grid-template-columns: auto auto;
      }

      .c1 {
        border-radius: 50%;
        width: 80px;
      }

      .c2 {
        font-size: 30px;
      }

      <div>
        <div
          class="c0"
        >
          <img
            alt="User"
            class="c1"
            src="imageUrl"
          />
          <h1
            class="c2"
          >
            username
            's clips
          </h1>
        </div>
      </div>
    `)
  })

  it('shows empty alt', () => {
    const { container } = render(<ProfileCard user={{ id: 1, folders: [], image: null, name: null, username: null }} />)
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: grid;
        grid-gap: 16px;
        grid-template-columns: auto auto;
      }

      .c1 {
        border-radius: 50%;
        width: 80px;
      }

      .c2 {
        font-size: 30px;
      }

      <div>
        <div
          class="c0"
        >
          <img
            alt="User"
            class="c1"
          />
          <h1
            class="c2"
          >
            's clips
          </h1>
        </div>
      </div>
    `)
  })
})
