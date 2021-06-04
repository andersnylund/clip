import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { getBrowserName, supportedBrowsers } from '../browser'
import { useAppDispatch, useAppSelector } from '../hooks'
import { PROFILE_PATH } from '../hooks/useProfile'
import { showToast } from '../notifications/notification-reducer'
import { Clip } from '../types'
import { Button } from './buttons'
import { NotSupportedModal } from './NotSupportedModal'
import { StyledModal } from './StyledModal'
import { setImportExportState } from '../import-export/import-export-reducer'

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
      body: JSON.stringify({ clips }),
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
    window.postMessage({ type: 'IMPORT_BOOKMARKS' }, window.location.toString())
  }

  const onImportMessage = (message: MessageEvent<{ type: string; payload: SimpleClip[] }>) => {
    if (message.data.type === 'IMPORT_BOOKMARKS_SUCCESS') {
      importClips(message.data.payload)
    }
  }

  useEffect(() => {
    window.addEventListener('message', onImportMessage)
    return () => {
      window.removeEventListener('message', onImportMessage)
    }
  }, [onImportMessage])

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
            <img data-testid="loading-spinner" className="p-14" src="/tail-spin.svg" alt="Loading spinner" />
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
