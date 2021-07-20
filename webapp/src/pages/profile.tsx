import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useProfile } from '../../../shared/hooks/useProfile'
import { PrimaryLink } from '../components/buttons'
import { DeleteProfile } from '../components/DeleteProfile'
import { Layout } from '../components/Layout'
import { UsernameModal } from '../components/UsernameModal'
import { UsernamePrompt } from '../components/UsernamePrompt'
import { useSignin } from '../hooks/useSignin'

const Profile: NextPage = () => {
  const [session, loading] = useSignin()
  const { profile } = useProfile()
  const router = useRouter()

  if (!session && !loading) {
    router.push('/')
  }

  const showPlaceholderImage = Boolean(!session?.user?.image)

  return session ? (
    <Layout title="Your profile">
      {profile && !profile?.username && <UsernameModal />}
      <div className="flex flex-col shadow-2xl rounded-3xl overflow-hidden">
        <div className="flex items-center gap-10 p-20">
          <img
            className={`rounded-full h-48 w-48 object-cover ${showPlaceholderImage ? 'bg-gray-100' : ''}`}
            src={session?.user?.image ?? '/android-chrome-256x256.png'}
            alt="Profile"
          />
          <div className="flex flex-col gap-4">
            <p>{session?.user?.email}</p>
            <UsernamePrompt />
          </div>
        </div>
        {profile?.username && (
          <div className="flex flex-col gap-6 items-center w-full h-full pb-10">
            <Link href="/clips" passHref>
              <PrimaryLink color="primary">Clips</PrimaryLink>
            </Link>
          </div>
        )}
        <div className="flex flex-col gap-6 items-center w-full h-full p-10 bg-red-100">
          <DeleteProfile profile={profile} />
        </div>
      </div>
    </Layout>
  ) : null
}

export default Profile
