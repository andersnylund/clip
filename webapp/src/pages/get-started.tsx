import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { Layout } from '../components/Layout'

const Card: FC<{ imageSource: string; href: string; text: string }> = ({ imageSource, href, text }) => (
  <a href={href} className="flex items-center flex-col m-10">
    <Image src={imageSource} height={112} width={112} alt={`${text} extension`} />
    <div className="text-base text-gray-600">{text}</div>
  </a>
)

const ListItem: FC = ({ children }) => (
  <li className="text-xl text-gray-800 font-bold shadow-lg m-2 rounded-3xl p-10">{children}</li>
)

const Description: FC = ({ children }) => <div className="text-base pt-6 text-gray-600">{children}</div>

const GetStarted: NextPage = () => (
  <Layout title="Get Started">
    <ol className="flex flex-col gap-20 max-w-xl">
      <ListItem>
        Create your profile
        <Description>
          Go to{' '}
          <Link href="/api/auth/signin">
            <a className="text-yellow-600 hover:text-yellow-700 underline">sign in</a>
          </Link>{' '}
          and create a profile
        </Description>
      </ListItem>
      <ListItem>
        Download the extensions
        <div className="flex justify-center flex-wrap">
          <Card
            imageSource="/chromium.svg"
            href="https://chrome.google.com/webstore/detail/clipso/gjbelnkifheaicnfbekpcjcgnhefdgcf"
            text="Chromium"
          />
          <Card
            imageSource="/firefox.svg"
            href="https://addons.mozilla.org/en-US/firefox/addon/clip-so"
            text="Firefox"
          />
        </div>
      </ListItem>
      <ListItem>
        Enable syncing
        <Description>
          Go to your{' '}
          <Link href="/profile">
            <a className="text-yellow-600 hover:text-yellow-700 underline">profile</a>
          </Link>
          and enable syncing.
        </Description>
      </ListItem>
      <ListItem>
        Import and export
        <Description>
          Go to your{' '}
          <Link href="/clips">
            <a className="text-yellow-600 hover:text-yellow-700 underline">clips</a>
          </Link>
          . Import from one browser bookmarks bar and export to another
        </Description>
      </ListItem>
    </ol>
  </Layout>
)

export default GetStarted
