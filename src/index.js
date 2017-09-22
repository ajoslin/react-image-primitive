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
    canLoad: true,
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
    if (nextProps.src === this.props.src && nextProps.canLoad === this.props.canLoad) return
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
        if (!error) {
          imageCache[src] = true
        }

        // Only set loaded if this is the most current props.src
        if (this.props.src === src) {
          this.update({ loaded: true, pending: false, error })
        }
      })
    }
  }

  render () {
    return this.props.render(this.getRenderProps())
  }
}
