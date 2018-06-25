var blessed = require('blessed')
module.exports = function(screen) {
  const box = blessed.box({
    top: 'center',
    left: 'center',
    width: '100%',
    height: '100%',
    content: 'Hello {bold}world{/bold}!',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'magenta',
      border: {
        fg: '#f0f0f0'
      },
      hover: {
        bg: 'green'
      }
    }
  })

  // If our box is clicked, change the content.
  box.on('click', function() {
    box.setContent('{center}Some different {red-fg}content{/red-fg}.{/center}')
    screen.render()
  })

  // If box is focused, handle `enter`/`return` and give us some more content.
  box.key('enter', function() {
    box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n')
    box.setLine(1, 'bar')
    box.insertLine(1, 'foo')
    screen.render()
  })

  return box
}

