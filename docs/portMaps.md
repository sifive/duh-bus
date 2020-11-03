
```js
{component:{
  busInterfaces:[{
    abstractionTypes: [{
      portMaps: {
        LogicalPortName: <X>
      }
    }]
  }]
}}
```

`'physicalPortName'` -- full physical port name

`port[0]` -- bit-select

`port[7:0]` -- bit-slice

`{port: 'port', label: 'rx_done'}` -- object with more

```js
[
  'port2[7:0]',
  'port0',
  'port1[0]',
  {port: 'port3', label: 'rx_done', ...}
]
```
-- Concatenation of physical ports or slices
