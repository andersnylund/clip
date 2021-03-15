import React, { FC, useState } from 'react'
import { getBrowserName, supportedBrowsers } from '../browser'
import { useProfile } from '../hooks/useProfile'
import { Button } from './buttons'
import { Container, WarningText } from './Import'
import { NotSupportedModal } from './NotSupportedModal'
import { StyledModal } from './StyledModal'

export const Export: FC = () => {
  const { profile } = useProfile()
  const [modalState, setModalState] = useState<'closed' | 'warning' | 'invalidBrowser'>('closed')

  const browserName = getBrowserName()

  if (!profile) {
    return null
  }

  const show = () => {
    if (!supportedBrowsers.includes(browserName ?? /* istanbul ignore next */ '')) {
      return setModalState('invalidBrowser')
    } else {
      return setModalState('warning')
    }
  }

  const postExportMessage = () => {
    window.postMessage({ type: 'EXPORT_BOOKMARKS', payload: profile.clips }, window.location.toString())
    setModalState('closed')
  }

  // TODO: handle EXPORT_BOOKMARKS_SUCCESS and show success modal

  return (
    <>
      <div data-testid="modal-background" />
      <Button onClick={show}>Export to bookmark bar</Button>
      <NotSupportedModal isInvalidBrowser={modalState === 'invalidBrowser'} onClose={() => setModalState('closed')} />
      <StyledModal
        isOpen={modalState === 'warning'}
        onRequestClose={/* istanbul ignore next */ () => setModalState('closed')}
      >
        <Container>
          <WarningText>
            <span role="img" aria-label="Warning">
              ⚠️
            </span>
            <p>Exporting to bookmarks bar will overwrite all bookmarks</p>
          </WarningText>
          <Button color="warning" onClick={postExportMessage}>
            Export and overwrite
          </Button>
          <Button onClick={() => setModalState('closed')}>Cancel</Button>
        </Container>
      </StyledModal>
    </>
  )
}
