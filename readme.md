# react-image-primitive [![Build Status](https://travis-ci.org/ajoslin/react-image-primitive.svg?branch=master)](https://travis-ci.org/ajoslin/react-image-primitive)

> Declaratively fetch image. Use a render prop to get error/pending/loaded state for the image. Set whether the image can be fetched with prop.

```jsx
import ImagePrimitive from 'react-image-primitive'
ReactDOM.render(
  <ImagePrimitive
    src={'/my-image.jpg'}
    render={({
      src,
      pending,
      error,
      loaded
    }) => !loaded ? <div className='spinner' /> : <img src={src} />}
  />,
  document.body
)
```

## `<ImagePrimitive />`

### Props

### src

> `string`

The image `src` to load.

### canLoad

> `boolean` | default true

If `canLoad` is false and the given `src` has not been fetched before, it will not be fetched.

### onChange

> `function` | optional

Called whenever the loaded state of the image at `src` changes, with the same props as `render` (below).

### render

> `function` | *required*

This function is called with `({ src, loaded, pending, error })` whenever any of those values updates.

Use this to render your elements in reaction to the image loading state (see example at the top).

## License

MIT © [Andrew Joslin](http://ajoslin.com)
