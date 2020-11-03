### Example 1

DUH Bus Definition (busDefinition) document defines a **busType** with unique `<busVLNV>` signature.

```js
{busDefinition: {
  <busVLNV>
}}
```

DUH component document may instantiate one or more Bus Interfaces (busInterface) of specific **busType**.

```js
{component: {
  <compVLNV>,
  busInterfaces: [
    {name, interfaceMode, busType: {<busVLNV>}}
    ...
  ]
}
```

### Example 2

DUH abstraction definition (abstractionDefinition) document describes low-level aspects of a **busType**

For example: RTL abstraction requires `ports -> logPort -> wire` element.

```js
{abstractionDefinition: {
  <busVLNVrtl>,
  busType: { <busVLNV> },
  ports: {
    logPort: {
      wire: {
        onInitiator: { presence, width, direction },
        onTarget: { presence, width, direction },
        requiresDriver
      }
    }
  }
}}
```

some of of wire properties `presence`, `direction`, `width` can be asserted per busInterface instance

DUH component can describe abstraction type view (**viewRef**) of specific **busType**

```js
{component: {
  <compVLNV>,
  model: {ports: {
    phyPort: 1 // direction and width
  }},
  busInterfaces: [{
    name, interfaceMode,
    busType: { <busVLNV> },
    abstractionTypes: [{
      viewRef: 'RTLview',
      portMaps: {
        logPort: 'phyPort'
      }
    }]
  }],
}}
```


```js
{abstractionDefinition: {
  <busVLNVrtl>,
  busType: { <busVLNV> },
  ports: {
    logPort: {
      wire: {
        onInitiator: { presence, width, direction },
        onTarget: { presence, width, direction },
        requiresDriver
      }
    }
  }
}}
```

### Example 3

abstractionDefinition document can define:
* a set of own properties `props` in form of JSON schema.
* **assertions** can be defined as array of boolean expressions. `onTarget` & `onInitiator` suffix can be used to differentiate roles.

```js
{abstractionDefinition: {
  <busVLNVrtl>,
  busType: { <busVLNV> },
  ports: { ... },
  props: {
    writeInterleavingDepth: {type: 'integer', ... }, // JSON schema
    outstandingTransactions: { ... }
    ...
  },
  assertions: [
    'writeInterleavingDepth.onTarget >= writeInterleavingDepth.onInitiator',
    'outstandingTransactions.onTarget == outstandingTransactions.onInitiator'
  ]
}}
```

* Component can define set of own properties `props` or (`pSchema`) as JSON schema.
* `model -> ports` value can be integer expression using `props` as arguments.
* **assertions** can be defined as array of boolean expressions. busInterface properties can be accessed using `busInterface.<interface mame>.<prop name>`

```js
{component: {
  <compVLNV>,
  props: { // or pSchema now
    DW: {type: 'integer'}, // JSON schema
    outstanding: {type: 'integer', default: 0} // may have default
  },
  model: {ports: {
    axi1_wdata: '-(8 * DW)' // integer expression
  }},
  busInterfaces: [{
    name: 'name1',
    interfaceMode,
    busType: { <busVLNV> },
    abstractionTypes: [{
      viewRef: 'RTLview',
      portMaps: { ... }
    }]
  }],
  assertions: [
    'busInterface.name1.writeInterleavingDepth == 4',
    'busInterface.name1.outstandingTransactions == outstanding'
  ]
}}
```
