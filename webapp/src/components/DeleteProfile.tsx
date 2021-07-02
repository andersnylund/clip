import Router from 'next/router'
import React, { FC, useState } from 'react'
import { mutate } from 'swr'
import { PROFILE_PATH } from '../../../shared/hooks/useProfile'
import { User } from '../../../shared/types'
import { RedButton, TransparentButton } from './buttons'
import { StyledModal } from './StyledModal'

export const DeleteProfile: FC<{ profile?: User }> = ({ profile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const deleteProfile = async () => {
    await fetch('/api/profile', {
      method: 'DELETE',
    })
    await mutate(PROFILE_PATH)
    await Router.push('/')
    Router.reload()
  }

  return profile ? (
    <>
      <RedButton onClick={() => setIsModalOpen(!isModalOpen)}>Delete your profile</RedButton>
      <StyledModal isOpen={isModalOpen}>
        <div className="p-10">
          <div className="flex gap-8">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Delete your profile</h2>
              <h3 className="text-md font-bold text-gray-700 pt-6">
                Are you sure you want to delete your profile? Deleting your profile is irreversible
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4">
          <div className="flex justify-end gap-4">
            <TransparentButton onClick={() => setIsModalOpen(false)}>No</TransparentButton>
            <RedButton color="danger" onClick={deleteProfile}>
              Yes
            </RedButton>
          </div>
        </div>
      </StyledModal>
    </>
  ) : null
}
