import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import React, { FC, FormEvent, useState } from 'react'
import { mutate } from 'swr'
import { removeClip } from '../../../shared/clip'
import { PROFILE_PATH } from '../../../shared/hooks/useProfile'
import { Input } from '../text-styles'
import { Button } from './buttons'

type ClipWithoutUrl = {
  id: string
  parentId: string | null
  title: string
}

export const FolderHeader: FC<{ folder: ClipWithoutUrl; onRemove?: () => void }> = ({ folder, onRemove }) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [folderTitle, setFolderTitle] = useState(folder.title)

  const updateFolder = async (e: FormEvent) => {
    e.preventDefault()
    await fetch(`/api/clip/${folder.id}`, {
      body: JSON.stringify({ title: folderTitle }),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    await mutate(PROFILE_PATH)
    setIsEditOpen(false)
  }

  return isEditOpen ? (
    <form className="flex gap-1" onSubmit={updateFolder}>
      <Input className="flex-1" value={folderTitle} onChange={(e) => setFolderTitle(e.target.value)} />
      <Button type="submit">Save</Button>
    </form>
  ) : (
    <div className="flex group justify-between items-center w-full gap-1">
      <div className="flex font-bold" data-testid={`clip-header-${folder.title}`}>
        {folder.title}
      </div>
      <div className="flex opacity-0 group-hover:opacity-100 gap-1">
        <Button title="Edit" onClick={() => setIsEditOpen(true)}>
          <Pencil2Icon />
        </Button>
        <Button title="Remove" onClick={() => removeClip(folder.id, onRemove)}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  )
}
