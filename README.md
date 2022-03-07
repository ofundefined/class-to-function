# class-to-function

This command line can be used to convert React class components to become functional components.

## Installation

Install it as a global command line if you will. This way you can use the command line `class-to-function` from your own project to convert your components.

```
npm install -g class-to-function
```

or

```
yarn global add class-to-function
```

## Usage

You just need to run to command line with the path of the file you want to convert

```
class-to-function ./src/yourcomponent/*.tsx
```

## Current limitations

Please feel free to contribute to this project.

- This version is ready for typescript only components.
- This version is not covering all lifecycle methods, like `shouldComponentUpdate` and `componentWillUnmount`.
