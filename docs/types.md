## Ports

External interface of the component:
  * name = physicalPort (`string`)
  * direction = (input, output, inout)
  * width = integer number (fixed or parametric)

```js
{
  foo: 5,   // input [4:0] foo,
  bar: -3,  // output [2:0] bar,
  baz: '-WIDTH', // output [WIDTH-1:0] baz,
  qux: {direction: 'inout', width: 7} // inout [6:0] qux
}
```

## Bundle

Named Array of physicalPort names grouped by some principle.

```js
{
  spam: ['ham', 'eggs']
  ...
}
```

### Directed Bundle

[Bundle](#Bundle) where all elements have same direction.

### Uniform Bundle

[Directed Bundle](#directed-bundle) where all elements have same width.

### Prefix Bundle

Bundle grouped by name prefix.

```js
{
  cat: ['cat_foo', 'cat_bar', 'cat_baz']
}
```

### Index Bundle

[Uniform](#unform-bundle), [Prefix Bundle](#prefix-bundle) grouped and ordered by index. `index = [0..LEN)`

```js
{
  dog: ['dog_0', 'dog_1', 'dog_2', 'dog_3']
}
```

### Matrix Bundle

Multi-dimensional [Uniform Bundle](#uniform-bundle).

```js
{
  pack: [
    ['dog_00', 'dog_01', 'dog_02'],
    ['dog_10', 'dog_11', 'dog_12']
  ]
}
```

## Bus Interface

Named Object with specific:
  * `type` -- Instance type (`string`)
  * `body` -- physicalPort, [Bundle](#bundle), Named Object

```js
mySpam: {
  type: 'spam',
  body: {
    foo: {
      cmd: 'my_foo_cmd',
      dat: 'my_foo_dat'
    },
    bar: 'my_bar',
    eggs: ['my_egg0', 'my_egg1']
  }
}
```

### Channel

Standard Bus Interface:
  * valid = physicalPort name (width=1) (initiator -> target)
  * ready = physicalPort name (width=1) (target -> initiator)
  * bits = physicalPort name, [Directed Bundle](#directed-bundle) (initiator -> target)

```js
{
  pixel: {
    type: 'channel',
    body: {
      valid: 'pixel_val',
      ready: 'pixel_rdy',
      bits: ['pixel_cmd', 'pixel_dat']
    }
  }
}
```
