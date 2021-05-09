import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React, { FC, FormEvent, useState } from 'react'
import { mutate } from 'swr'
import { PROFILE_PATH } from '../hooks/useProfile'
import { Input } from '../text-styles'
import { Button } from './buttons'

export type ClipWithUrl = {
  id: string
  parentId: string | null
  title: string
  url: string
}

export type Props = {
  clip: ClipWithUrl
  onRemove?: () => void
}

export const ClipHeader: FC<Props> = ({ clip, onRemove }) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [clipTitle, setClipTitle] = useState(clip.title)
  const [clipUrl, setClipUrl] = useState(clip.url)

  const removeClip = async () => {
    onRemove && onRemove()
    await fetch(`/api/clip/${clip.id}`, { method: 'DELETE' })
    await mutate(PROFILE_PATH)
  }

  const updateClip = async (e: FormEvent) => {
    e.preventDefault()
    await fetch(`/api/clip/${clip.id}`, {
      body: JSON.stringify({ url: clipUrl, title: clipTitle }),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    await mutate(PROFILE_PATH)
    setIsEditOpen(false)
  }

  return isEditOpen ? (
    <form className="flex gap-1 items-center" onSubmit={updateClip}>
      <div className="flex flex-col">
        <Input value={clipTitle} onChange={(e) => setClipTitle(e.target.value)} />
        <Input value={clipUrl} onChange={(e) => setClipUrl(e.target.value)} />
      </div>
      <Button type="submit">Save</Button>
    </form>
  ) : (
    <div className="flex gap-1 items-center justify-between w-full group">
      <Link href={clip.url} passHref>
        <a className="hover:underline" data-testid={`clip-header-${clip.title}`}>
          {clip.title}
        </a>
      </Link>
      <div className="flex gap-1 pl-1 opacity-0 group-hover:opacity-100">
        <Button title="Edit" onClick={() => setIsEditOpen(true)}>
          <Pencil2Icon />
        </Button>
        <Button title="Remove" onClick={removeClip}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  )
}
