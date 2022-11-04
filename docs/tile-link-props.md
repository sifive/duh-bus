
Parameters used to create individual tilelink bundles:

- `addressBits: Int`: Width of address field in bits, channels `ABC`
- `dataBits: Int`: Width of data path in bits, mask field width is derived from this by dividing it by 8, channels `ACD`, in the near future we want to make this able to be different per-channel
- `sourceBits:  Int`:  Width of source id field in bits, channels `ACE`
- `sinkBits: Int`:  Width of sink id field in bits, channels `DE`
- `sizeBits: Int,`: Width of transaction size field in bits, channels `ABCD`, could plausibly differ per channel

Example:

```js
{component: {
  model: {ports:{
    ...,
    tl0_a_addr: 16, // (1)
    tl0_a_data: 32,
    tl0_b_addr: -14, // (3)
  }},
  busInterfaces: [{
    name: 'tl0', interfaceMode: 'slave', // (4)
    busType: {vendor: 'sifive.com', library: 'TL', name: 'C', version: '1.0.0'},
    abstractionTypes: [{
      portMaps: {
        ...,
        a_address: 'tl0_a_addr', // (2)
        a_data: 'tl0_a_data',
        b_address: 'tl0_b_addr',
        // c_address --> (5)
      }
    }]
  }]
}}
```

Note:
1. width of physical port of component defined here
2. width can be discovered from port mapping
3. width can be different per channel `AD[BC]`
4. inerfaceMode can be `master` or `slave`

```js
{abstractionDefinition: {
  ..., // (1)
  busType: {vendor: 'sifive.com', library: 'TL', name: 'C', version: '1.0.0'},
    ports: { // (2)
      ...,
      a_valid: {
        description: 'The sender is offering progress on an operation.',
        wire: { // (3)
          onMaster: {direction: 'out', width: 1, presence: 'required'}, // (4)
          onSlave:  {direction: 'in',  width: 1, presence: 'required'}
        }
      },
      a_data: {
        description: 'Data payload for messages with data.',
        wire: {
          isData: true,
          onMaster: {direction: 'out', width: [8, 16, 32, 64, 128, 256]}, // (5)
          onSlave:  {direction: 'in',  width: [8, 16, 32, 64, 128, 256]}
        }
      },
      ...,
    }
  }
}
```

Note:
1. **busDef** = `abstractionDefinition` document has to be provided that has matching `busType`
2. list of possible logic ports
3. expectations for `master` and `slave` interfaces of this type
4. `presence: 'required'` attribute when port mapping is required
5. `width` constraints

---
- `echoFields:  Seq[BundleField]`:  A list of user bit fields that conform to the ECHO behavior, channels `AD`
- `requestFields:  Seq[BundleField]`:  A list of user bit fields that are sent with requests, channel `A`
- `responseFields: Seq[BundleField`:  A list of user bit fields that are sent with responses, channel `D`
- `probeEchoFields:  Seq[BundleField]`:  A list of user bit fields that conform to the ECHO behavior, channels `BC`
-  `probeRequestFields:  Seq[BundleField]`:  A list of user bit fields that are sent with requests, channel `B`
-  `probeResponseFields: Seq[BundleField`:  A list of user bit fields that are sent with responses, channel `C`

Note:

Will have associated ports.

---
- `hasBCE: Boolean`: Whether channels `BCE` even exist on the link

Note:
can be inferred from `TL` profile:
* `UL`, `UH` = false
* `C` = true;

---

These are pretty specific to the on-chip, parallel physical channel implementation currently used in most of our interconnects.



---

```js
{component: {
  model: {ports:{
    ...,
    tl0_a_addr: 16, // (1)
    tl0_a_data: 32,
    tl0_b_addr: -14, // (3)
  }},
  busInterfaces: [{
    name: 'tl0', interfaceMode: 'slave', // (4)
    busType: {vendor: 'sifive.com', library: 'TL', name: 'C', version: '1.0.0'},
    abstractionTypes: [{
      portMaps: {
        ...,
        a_address: 'tl0_a_addr', // (2)
        a_data: 'tl0_a_data',
        b_address: 'tl0_b_addr',
        // c_address --> (5)
      }
    }]
  }]
}}
```


Parameters used to calculate the above parameters based on the specific masters and slaves that can see a given link:

- `maxAddress: Int`: across all masters and slaves, the highest address owned by any slave that is visible to any master

Can be calculated by knowing:

Master:

```js
comp.busInterfaces.reduce((maxAddress, bi) => {
  if (isTL(bi) && bi.interfaceMode === 'master') {
    const as = comp.addressSpaces.find(ref => ref === bi.addressSpaceRef);
    return max(maxAddress, as.range);
  }
  return maxAddress;
}, 0)
```

Slave:

```js
comp.busInterfaces.reduce((maxAddress, bi) => {
  if (isTL(bi) && bi.interfaceMode === 'slave') {
    const mm = comp.memoryMaps.find(ref => ref === bi.memoryMapRef);
    const curMaxAddress = mm.addressBlocks.reduce((res, ab) =>
      max(res, ab.baseAddress + ab.range);
    }, 0);
    return max(maxAddress, mm.rang);
  }
  return maxAddress;
})
```

---

- `endSourceId: Int`: across all masters, the largest source id used by any master (number of outstanding master requests)

```js
comp.busInterfaces.reduce((maxId, bi) => {
  if (isTL(bi) && bi.interfaceMode === 'master') {
    let ids = 0;
    if (bi.sourceIds) {
      ids = bi.sourceIds;
    } else {
      const port = bi.portMap.a_source;
      if (port) {
        const width = width(comp.model.port[port]);
        ids = 2 ** width - 1;
      }
    }
    maxId = max(maxId, ids);
  }
  return maxId;
}, 0)
```

- `sendSinkId: Int`: across all slaves, the largest sink id used by any slave (number of outstanding slave requests)

```js
comp.busInterfaces.reduce((maxId, bi) => {
  if (isTL(bi) && bi.interfaceMode === 'slave') {
    let ids = 0;
    if (bi.sinkIds) {
      ids = bi.sinkIds;
    } else {
      const port = bi.portMap.d_sink;
      if (port) {
        const width = width(comp.model.port[port]);
        ids = 2 ** width - 1;
      }
    }
    maxId = max(maxId, ids);
  }
  return maxId;
}, 0)
```

- `maxTransactionSize: Int`: across all masters and slaves, across all types of operations' sizes, the largest size that is both emitted by any master and supported by any slave, or emitted by any slave and supported by any master
- `echoFields: Seq[BundleField]`: union of all echoFields used by any master
- `requestFields: Seq[BundleField]`: union of all requestFields emitted by any master and accepted by any slave
- `responseFields: Seq[BundleField]`: union of all responseFields emitted by any slave and accepted by any master
- `probeEchoFields: Seq[BundleField]`: union of all echoFields used by any master
- `probeRequestFields: Seq[BundleField]`: union of all requestFields emitted by any slave and accepted by any master
- `probeResponseFields: Seq[BundleField]`: union of all responseFields emitted by any master and accepted by any slave
- `anySupportProbe && anySupportsAcquire`: intersection of whether any master is ever able to acquire cached copies of any slave's data in a way that requires being probed for coherence
- `fifoDomains`: the total number of unique FIFO Ids used by all slaves

These properties are probably generally applicable regardless of which physical serialization of TileLink operations is used.













---













Parameters that are tracked for every master, as they appear on a particular link:
- `visibility: Seq[AddressSet]`: address ranges this master expects to be able to see
- `unusedRegionTypes: Set[RegionType]`: region types this master does not need to use
- `executesOnly: Boolean`: whether this master only executes code (e.g. icache)
- `requestFifo: Boolean`: whether this master would like its operations performed in FIFO order.
- `supports: TLSlaveToMasterTransferSizes`: for each operation type, transfer sizes this master supports
- `emits: TLMasterToSlaveTransferSizes`: for each operation type, transfer sizes this master emits
- `neverReleasesData: Boolean`:
- `sourceId: IdRange`: the number of outstanding transactions this master can have in flight

Parameters thats are tracked for every slave, as they appear on a particular link:
- `address: Seq[AddressSet]`: address ranges that this slave is responsible for managing
- `regionType:  RegionType`: supported memory access semantics and attributes on the above ranges
- `executable: Boolean`: the orthogonal executable memory attribute
- `fifoId: Option[Int]`: whether the slave support FIFO memory access and which FIFO id it is associated with
- `supports: TLMasterToSlaveTransferSizes`: for each operation type, transfer sizes this slave supports
- `emits: TLSlaveToMasterTransferSizes`: for each operations type, transfer sizes this slave emits
- `alwaysGrantsT: Boolean`: whether this slave always provides exclusive access to cacheable memory operations
- `mayDenyGet: Boolean`: whether this slave can send error responses on reads
- `mayDenyPut`: whether this slave can send error responses on writes

Region types which are used to generate PMAs:
- `CACHED`: an intermediate agent may have cached a copy of the region for you
- `TRACKED`: the region may have been cached by another master, but coherence is being provided
- `UNCACHED`: the region has not been cached yet, but should be cached when possible
- `IDEMPOTENT`: `Gets` always return the most recently `Put` content, but content should not be cached
- `VOLATILE`: content may change between `Gets` without an intervening `Put`, but `Puts` and `Gets` have no side effects
- `PUT_EFFECTS`: `Puts` produce side effects and so must not be combined/delayed
- `GET_EFFECTS`: `Gets` produce side effects and so must not be issued speculatively
