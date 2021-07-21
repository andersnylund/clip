import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useProfile } from '../../../shared/hooks/useProfile'
import { PrimaryLink } from '../components/buttons'
import { DeleteProfile } from '../components/DeleteProfile'
import { Layout } from '../components/Layout'
import { Toggle } from '../components/Toggle'
import { UsernameModal } from '../components/UsernameModal'
import { UsernamePrompt } from '../components/UsernamePrompt'
import { isSiteEnvDev } from '../hooks/usePublicConfig'
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
      <div className="flex flex-col gap-6 shadow-2xl rounded-3xl overflow-hidden">
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
          <div className="flex flex-col gap-6 items-center w-full h-full">
            <Link href="/clips" passHref>
              <PrimaryLink color="primary">Clips</PrimaryLink>
            </Link>
          </div>
        )}
        {isSiteEnvDev() && (
          <div className="pt-12">
            <div className="flex flex-col gap-2 pb-4 items-center w-3/4 max-w-xl mx-auto text-center text-gray-600 text-sm">
              <p className="text-yellow-800">
                <strong>Enabling cross browser syncing might cause data loss</strong>. In each browser where you install
                the clip.so extension, the browser&apos;s toolbar folders and bookmarks will be overriden with folders
                and bookmarks that you have stored in <strong>clip.so</strong>.
              </p>
              <span className="text-lg" role="img" aria-label="Warning">
                ⚠️
              </span>
            </div>
            <Toggle label="Enable cross browser syncing" />
          </div>
        )}
        <div className="flex flex-col gap-6 items-center w-full h-full p-10 bg-gray-100">
          <DeleteProfile profile={profile} />
        </div>
      </div>
    </Layout>
  ) : null
}

export default Profile
