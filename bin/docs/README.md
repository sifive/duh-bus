# Clocks

Every bus interface will have one clock port associated with it.

All Ports mapped by the busInterface must be in this clock domain.

Clock port can be reused by multiple busInterfaces.

Non-standard busInterfaces must have clock too.

```js
{
  component: {
    busInterfaces: [{
      name: 'irq',
      interfaceMode: 'master',
      busType: {...},
      abstractionTypes: [{
        viewRef: 'RTLview',
        clock: 'clk',
        portMaps: [
          'irq0',
          'irq1'
        ]
      }]
    }]
  }
}  
```

busInterface with clock = null may contain only inputs with internal clock re-synchronizers.
