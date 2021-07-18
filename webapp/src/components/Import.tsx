import Image from 'next/image'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { PROFILE_PATH } from '../../../shared/hooks/useProfile'
import { IMPORT_BOOKMARKS, IMPORT_BOOKMARKS_SUCCESS } from '../../../shared/message-types'
import { Clip } from '../../../shared/types'
import { getBrowserName, supportedBrowsers } from '../browser'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setImportExportState } from '../import-export/import-export-reducer'
import { showToast } from '../notifications/notification-reducer'
import { Button } from './buttons'
import { NotSupportedModal } from './NotSupportedModal'
import { StyledModal } from './StyledModal'

export type SimpleClip = Omit<Clip, 'userId' | 'clips'> & {
  clips: SimpleClip[]
}

export const Import: FC = () => {
  const [modalState, setModalState] = useState<'closed' | 'warning' | 'invalidBrowser'>('closed')
  const browserName = getBrowserName()
  const dispatch = useAppDispatch()
  const importState = useAppSelector((state) => state.importExport.importState)

  const importClips = async (clips: SimpleClip[]) => {
    const response = await fetch('/api/clips/import', {
      method: 'POST',
      body: JSON.stringify(clips),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setModalState('closed')
    if (response.ok) {
      dispatch(showToast({ message: 'Bookmarks imported successfully', type: 'SUCCESS' }))
      dispatch(setImportExportState({ key: 'importState', state: 'SUCCESS' }))
    } else {
      dispatch(showToast({ message: 'Import failed', type: 'FAILURE' }))
      dispatch(setImportExportState({ key: 'importState', state: 'FAILURE' }))
    }
    await mutate(PROFILE_PATH)
  }

  const handleClick = () => {
    if (!supportedBrowsers.includes(browserName ?? '')) {
      return setModalState('invalidBrowser')
    } else {
      return setModalState('warning')
    }
  }

  const postMessage = () => {
    dispatch(setImportExportState({ key: 'importState', state: 'LOADING' }))
    window.postMessage({ type: IMPORT_BOOKMARKS }, window.location.toString())
  }

  useEffect(() => {
    const onImportMessage = (message: MessageEvent<{ type: string; payload: SimpleClip[] }>) => {
      if (message.data.type === IMPORT_BOOKMARKS_SUCCESS) {
        importClips(message.data.payload)
      }
    }

    window.addEventListener('message', onImportMessage)
    return () => {
      window.removeEventListener('message', onImportMessage)
    }
  })

  return (
    <>
      <Button onClick={handleClick}>Import from bookmark bar</Button>
      <NotSupportedModal isInvalidBrowser={modalState === 'invalidBrowser'} onClose={() => setModalState('closed')} />
      <StyledModal isOpen={modalState === 'warning'} onRequestClose={() => setModalState('closed')}>
        <Container className={`${importState === 'LOADING' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <WarningText>
            <span role="img" aria-label="Warning">
              ⚠️
            </span>
            <p>Importing bookmarks from bookmarks bar will overwrite your clip bookmarks</p>
          </WarningText>
          {importState === 'LOADING' ? (
            <div className="p-10">
              <Image alt="Loading spinner" data-testid="loading-spinner" height={36} src="/tail-spin.svg" width={36} />
            </div>
          ) : (
            <>
              <Button color="warning" onClick={postMessage}>
                Import and overwrite
              </Button>
              <Button onClick={() => setModalState('closed')}>Cancel</Button>
            </>
          )}
        </Container>
      </StyledModal>
    </>
  )
}

export const WarningText = styled.div`
  span {
    font-size: 2rem;
  }
`

export const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;

  ${Button} {
    margin-top: 0.5rem;
  }
`
