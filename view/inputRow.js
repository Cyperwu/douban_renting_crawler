var blessed = require('blessed')
module.exports = function(screen) {
  const line = blessed.box({
    bottom: 0,
    left: 'center',
    width: '100%',
    height: 10,
    content: 'Hello {bold}world{/bold}!',
    tags: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'grey',
      border: {
        fg: '#f0f0f0'
      },
      hover: {
        bg: 'green'
      }
    }
  })

  return line
}

