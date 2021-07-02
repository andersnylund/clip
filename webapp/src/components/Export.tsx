import React, { FC, useEffect, useState } from 'react'
import { EXPORT_BOOKMARKS, EXPORT_BOOKMARKS_ERROR, EXPORT_BOOKMARKS_SUCCESS } from '../../../shared/message-types'
import { getBrowserName, supportedBrowsers } from '../browser'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useProfile } from '../hooks/useProfile'
import { setImportExportState } from '../import-export/import-export-reducer'
import { showToast } from '../notifications/notification-reducer'
import { Button } from './buttons'
import { Container, WarningText } from './Import'
import { NotSupportedModal } from './NotSupportedModal'
import { StyledModal } from './StyledModal'

export const Export: FC = () => {
  const { profile } = useProfile()
  const [modalState, setModalState] = useState<'closed' | 'warning' | 'invalidBrowser'>('closed')
  const exportState = useAppSelector((state) => state.importExport.exportState)
  const dispatch = useAppDispatch()

  const browserName = getBrowserName()

  if (!profile) {
    return null
  }

  const show = () => {
    if (!supportedBrowsers.includes(browserName ?? '')) {
      return setModalState('invalidBrowser')
    } else {
      return setModalState('warning')
    }
  }

  const postExportMessage = () => {
    dispatch(setImportExportState({ key: 'exportState', state: 'LOADING' }))
    window.postMessage({ type: EXPORT_BOOKMARKS, payload: profile.clips }, window.location.toString())
  }

  const onExportMessage = (message: MessageEvent<{ type: string }>) => {
    if (message.data.type === EXPORT_BOOKMARKS_SUCCESS) {
      dispatch(showToast({ message: 'Exported successfully', type: 'SUCCESS' }))
      dispatch(setImportExportState({ key: 'exportState', state: 'SUCCESS' }))
      setModalState('closed')
    }
    if (message.data.type === EXPORT_BOOKMARKS_ERROR) {
      dispatch(showToast({ message: 'Export failed', type: 'FAILURE' }))
      dispatch(setImportExportState({ key: 'exportState', state: 'FAILURE' }))
      setModalState('closed')
    }
  }

  useEffect(() => {
    window.addEventListener('message', onExportMessage)
    return () => {
      window.removeEventListener('message', onExportMessage)
    }
  }, [onExportMessage])

  return (
    <>
      <Button onClick={show}>Export to bookmark bar</Button>
      <NotSupportedModal isInvalidBrowser={modalState === 'invalidBrowser'} onClose={() => setModalState('closed')} />
      <StyledModal isOpen={modalState === 'warning'} onRequestClose={() => setModalState('closed')}>
        <Container className={`${exportState === 'LOADING' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <WarningText>
            <span role="img" aria-label="Warning">
              ⚠️
            </span>
            <p>Exporting to bookmarks bar will overwrite all bookmarks</p>
          </WarningText>
          {exportState === 'LOADING' ? (
            <img data-testid="loading-spinner" className="p-14" src="/tail-spin.svg" alt="Loading spinner" />
          ) : (
            <>
              <Button color="warning" onClick={postExportMessage}>
                Export and overwrite
              </Button>
              <Button onClick={() => setModalState('closed')}>Cancel</Button>
            </>
          )}
        </Container>
      </StyledModal>
    </>
  )
}
