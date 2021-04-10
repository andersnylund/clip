import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { TreeItem } from '../../../src/components/Tree/TreeItem'

describe('<TreeItem />', () => {
  it('renders a TreeItem as a clip (with url)', () => {
    render(
      <TreeItem
        depth={1}
        clone
        childCount={3}
        item={{
          id: 'activeItem.id',
          title: 'activeItem.title',
          url: 'activeItem.url',
          parentId: 'activeItem.parentId',
        }}
        indentationWidth={1}
      />
    )

    expect(screen.getByTestId('tree-item-background')).toHaveClass('bg-gray-200')
  })

  it('renders a TreeItem as a folder (without url)', () => {
    render(
      <TreeItem
        depth={1}
        clone
        childCount={3}
        item={{
          id: 'activeItem.id',
          title: 'activeItem.title',
          url: null,
          parentId: 'activeItem.parentId',
        }}
        indentationWidth={1}
      />
    )

    expect(screen.getByTestId('tree-item-background')).toHaveClass('bg-gray-50')
  })

  it('handles onCollapse click', () => {
    const onCollapseMock = jest.fn()

    render(
      <TreeItem
        depth={1}
        clone
        childCount={3}
        item={{
          id: 'activeItem.id',
          title: 'activeItem.title',
          url: 'activeItem.url',
          parentId: 'activeItem.parentId',
        }}
        indentationWidth={1}
        onCollapse={onCollapseMock}
      />
    )

    fireEvent.click(screen.getByTitle('Toggle collapse'))
    expect(onCollapseMock).toHaveBeenCalled()
  })
})
