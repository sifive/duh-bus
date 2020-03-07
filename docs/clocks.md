# Clocks

## Rules:

* Every **port** must be mapped to at least one **busInterface**.
* Every **busInterface** must have one clock port associated with it.
* All **ports** mapped by the **busInterface** must be in the same single clock domain.
* **Clock port** can be reused by multiple **busInterfaces**.
* Non-standard busInterfaces must have clock too.
* **busInterface** with `clock == null` may contain only inputs with internal clock re-synchronizers.


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
