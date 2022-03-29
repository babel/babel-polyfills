# Contributing

Start with the [Babel core Contributing docs](https://github.com/babel/babel/blob/main/CONTRIBUTING.md).

## Developing

### Setup

Fork the `babel-polyfills` repository to your GitHub Account.

Then, run:

```sh
$ git clone https://github.com/<your-github-username>/babel-polyfills
$ cd babel-polyfills
$ yarn
```

Then you can either run:

```sh
$ yarn build
```

to build the repo **once** or:

```sh
$ yarn watch
```

to have the repo build itself and incrementally build files on change.

### Running linting/type-checking/tests

#### Lint

```sh
$ yarn lint
```

#### Type-check

```sh
$ yarn tscheck
```

#### Test

```sh
$ yarn test
```

## Creating a new polyfill

See [`docs/polyfill-provider.md`](https://github.com/babel/babel-polyfills/blob/main/docs/polyfill-provider.md).
