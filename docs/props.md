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
  ...
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
  <busVLNVrtl>, // abstraction signature
  busType: { <busVLNV> }, // bus type signature
  ports: {
    LogPort: { // declare logical port
      wire: { // physical port expectations
        onInitiator: { presence, width, direction },
        onTarget:    { presence, width, direction },
        requiresDriver
      }
    }
    ...
  }
}}
```

some of of wire properties `presence`, `direction`, `width` can be asserted per busInterface instance

DUH component can describe abstraction type view (**viewRef**) of specific **busType**

```js
{component: {
  ...
  model: {ports: {
    phyPort: 1 // direction and width
  }},
  busInterfaces: [{
    name, interfaceMode,
    busType: { <busVLNV> }, // reference to bus type signature
    abstractionTypes: [{
      viewRef: 'RTLview',
      abstractionRef: <busVLNVrtl> // reference to abstraction signature
      portMaps: {
        LogPort: 'phyPort' // logical mapping of physical port
        ...
      }
    }]
  }],
}}
```

### Example 3

abstractionDefinition document can define:
* a set of own properties `props` in form of JSON schema.
* **assertions** can be defined as array of boolean expressions. `onTarget` & `onInitiator` suffix can be used to differentiate roles.

```js
{abstractionDefinition: {
  <busVLNVrtl>,
  ...
  props: { // schema of own properties (immediate constraints)
    writeInterleavingDepth:  {type: 'integer', ... }, // JSON schema
    outstandingTransactions: { ... }
  },
  assertions: [ // cross constraints between initiator and target on connect
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
  <comp1VLNV>,
  props: { // schema of own properties (immediate constraints)
    DW: {type: 'integer'},
    outstanding: {type: 'integer', default: 0} // may have default
  },
  model: {ports: {
    axi1_wdata: '-(8 * DW)' // integer expression
  }},
  busInterfaces: [{
    name: 'axi_i', interfaceMode, busType,
    abstractionTypes: [{
      viewRef: 'RTLview',
      portMaps: {
        WDATA: 'axi1_wdata'
      }
    }]
  }],
  assertions: [ // boolean expressions
    'busInterface.axi_i.writeInterleavingDepth == 4',
    'busInterface.axi_i.outstandingTransactions == outstanding'
    // interface or own properties
  ]
}}
```

```js
{design:{
  <designVLNV>,
  instances: [
    {name: 'u1', ref: <comp1VLNV>},
    {name: 'u2', ref: <comp2VLNV>},
    ...
  ],
  connections: [
    {source: ['u1', 'axi_i'], target: ['u2', 'axi_t']},
    // check busType level cross constraints
  ],
  props: {
    WIDTH: {type: 'integer', default: 32}
  },
  assertions: [
    'instance.u1.DW == instance.u2.DW',
    'instance.u1.DW == WIDTH'
  ]
}}
```
