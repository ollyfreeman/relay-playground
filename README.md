# Relay Playground

This simple application is intended to help demonstrate the basics of GraphQL, Relay and React.

The framework of this repository borrows heavily from the [relay-started-kit](https://github.com/relayjs/relay-starter-kit/tree/master/data).

## Installation

```
npm install
```

## Running

Start a local server:

```
npm start
```

## Developing

Any changes you make to files in the `js/` directory will cause the server to
automatically rebuild the app and refresh your browser.

If at any time you make changes to `data/schema.js`, stop the server,
regenerate `data/schema.json`, and restart the server:

```
npm run update-schema
npm start
```

## Web app

You can view and interact with the web application at:

```
localhost:3000?userId=<userId>
```
where `<userId>` is `1`, `2`, `3` or `4`.

The two points of interest in the web app are:
* you can change the name of a user - _a mutation_
* you can select a friend of the current user to see additional details - _a parametrised field_

## GraphQL server

To run manual queries against the GraphQL server, use the GraphIQL endpoint at:

```
localhost:3000/graphql
```
There is one root-level query (`user`) and one root-level mutation (`changeName`).

In the master branch, some of the transparency of the GraphQL server is obscured by the use of the the `graphql-relay-js` library. Reading the [GraphQL Relay specification](https://facebook.github.io/relay/docs/graphql-relay-specification.html#content) in conjunction with the [source](https://github.com/graphql/graphql-relay-js/tree/master/src) of `graphql-relay-js` will shed light on some of these library functions. Alternatively, you can see a more transparent implentation on the `manual-relay` branch.