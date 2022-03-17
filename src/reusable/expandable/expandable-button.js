import React, { Component } from 'react'
import { ExpandableContext } from './expandable'
import { Button } from '@reusable'

const cleanList = list => {
  return list
    .filter(x => (x ? true : false))
    .join(' ')
    .trim()
}

class ExpandableButtonComponent extends Component {
  render() {
    const { context } = this.props

    if (context.disabled) {
      return null
    }

    return (
      <Button {...this.props} onClick={() => context.toggleExpanded()}>
        {context.expanded
          ? cleanList(['Show fewer', this.props.name])
          : cleanList(['Show all', this.props.count, this.props.name])}
      </Button>
    )
  }
}

function ExpandableButton(props) {
  return (
    <ExpandableContext.Consumer>
      {context => <ExpandableButtonComponent {...props} context={context} />}
    </ExpandableContext.Consumer>
  )
}

export default ExpandableButton;
