# React Custom Light Slider

### Installation and Usage

First, install the component:

```sh
$ npm i -S react-custom-light-slider
// or
$ yarn add react-custom-light-slider
```
After you need to import the component itself and its styles on some React file, and then use the `<Carousel>`:

```js
// MyDemoComponent.jsx

import { Carousel } from 'react-custom-light-slider'
import 'react-custom-light-slider/dist/main.css'

// return or render() function:
return (
  <Carousel>
    <div>/* slide 1 content */</div>
    <div>/* slide 2 content */</div>
    <div>/* slide 3 content */</div>
    */ ... */
  </Carousel>
)

```

## Development
### How to run:

First of all you need to install the dependencies for this project:

```sh
$ npm i
// or
$ yarn install
```

After package dependencies installation you can go for the app running properly:

```sh
$ npm run dev
// or
$ yarn dev
```

The application will be available over <http://localhost:4000>

### Stack:

- React
- SASS
- Webpack 5
- Babel
- Eslint
- Prettier
- Jest + React Testing Library

### To-do

- Add Storybook
- Add Documentation
- Add E2E tests

