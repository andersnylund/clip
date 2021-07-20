import { render } from '@testing-library/react'

import { ProfileCard } from '../../src/components/ProfileCard'

describe('<ProfileCard />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <ProfileCard
        user={{
          id: 1,
          clips: [],
          image: 'imageUrl',
          name: 'name',
          username: 'username',
          syncEnabled: false,
          syncId: null,
        }}
      />
    )
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
      }

      .c1 {
        border-radius: 50%;
        margin: 0 16px;
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
    const { container } = render(
      <ProfileCard
        user={{ id: 1, clips: [], image: null, name: null, username: null, syncEnabled: false, syncId: null }}
      />
    )
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
      }

      .c1 {
        border-radius: 50%;
        margin: 0 16px;
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
