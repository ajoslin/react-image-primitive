const React = require('react')
const PropTypes = require('prop-types')
const loadImage = require('load-img')

const imageCache = Object.create(null)

module.exports = exports.default = class ImagePrimitive extends React.Component {
  static cache = imageCache
  static propTypes = {
    src: PropTypes.string,
    canLoad: PropTypes.bool,
    onChange: PropTypes.func,
    render: PropTypes.func.isRequired
  }

  static defaultProps = {
    canLoad: false,
    onChange: () => {}
  }

  state = {
    loaded: false,
    pending: false,
    error: undefined
  }

  getRenderProps () {
    return {
      src: this.props.src,
      ...this.state
    }
  }

  componentDidMount () {
    this.onUpdate(this.props)
  }

  componentWillUpdate (nextProps) {
    this.onUpdate(nextProps)
  }

  update ({ loaded, pending, error }) {
    this.setState({ loaded, pending, error }, () => {
      this.props.onChange(this.getRenderProps())
    })
  }

  onUpdate ({ src, canLoad }) {
    const alreadyLoaded = src && (imageCache[src] !== undefined || /^data:/.test(src))

    if (alreadyLoaded) {
      this.update({ loaded: true, pending: false })
    } else if (!canLoad || !src) {
      this.update({ loaded: false, pending: false })
    } else {
      this.update({ loaded: false, pending: true })

      loadImage(src, (error) => {
        // If the image is finished loading but props.src changed, do nothing
        if (this.props.src !== src) return
        if (!error) {
          imageCache[src] = true
        }
        this.update({ loaded: true, pending: false, error })
      })
    }
  }

  render () {
    return this.props.render(this.getRenderProps())
  }
}
