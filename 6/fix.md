# Enigma Machine Bug Analysis and Fixes

## Bugs Identified and Fixed

### 1. **Missing Final Plugboard Swap** ❌➡️✅
**Issue**: The most critical bug was in the `encryptChar` method. The Enigma machine applies the plugboard transformation twice - once at the beginning and once at the end of the encryption process. The original code was missing the final plugboard swap.

**Original Code**:
```javascript
encryptChar(c) {
  // ... rotor stepping ...
  c = plugboardSwap(c, this.plugboardPairs);  // First plugboard swap
  // ... rotor forward pass ...
  c = REFLECTOR[alphabet.indexOf(c)];
  // ... rotor backward pass ...
  return c;  // ❌ Missing second plugboard swap!
}
```

**Fixed Code**:
```javascript
encryptChar(c) {
  // ... rotor stepping ...
  c = plugboardSwap(c, this.plugboardPairs);  // First plugboard swap
  // ... rotor forward pass ...
  c = REFLECTOR[alphabet.indexOf(c)];
  // ... rotor backward pass ...
  c = plugboardSwap(c, this.plugboardPairs);  // ✅ Added missing final plugboard swap
  return c;
}
```

**Impact**: Without this fix, messages encrypted with plugboard settings could not be properly decrypted, breaking the fundamental symmetry property of the Enigma machine.

### 2. **Incorrect Rotor Stepping Logic** ❌➡️✅
**Issue**: The original rotor stepping logic didn't properly handle the famous "double-stepping" anomaly of the Enigma machine.

**Original Code**:
```javascript
stepRotors() {
  if (this.rotors[2].atNotch()) this.rotors[1].step();
  if (this.rotors[1].atNotch()) this.rotors[0].step();
  this.rotors[2].step();
}
```

**Fixed Code**:
```javascript
stepRotors() {
  // Handle double-stepping anomaly properly
  const middleAtNotch = this.rotors[1].atNotch();
  const rightAtNotch = this.rotors[2].atNotch();
  
  // If middle rotor is at notch, both middle and left rotors step
  if (middleAtNotch) {
    this.rotors[0].step();
    this.rotors[1].step();
  }
  
  // If right rotor is at notch, middle rotor steps
  if (rightAtNotch) {
    this.rotors[1].step();
  }
  
  // Right rotor always steps
  this.rotors[2].step();
}
```

**Impact**: The double-stepping mechanism is crucial for the cryptographic strength of the Enigma. The original logic could cause incorrect rotor positions, leading to encryption/decryption mismatches.

### 3. **Rotor Position Calculation Errors** ❌➡️✅
**Issue**: The `forward` and `backward` methods in the `Rotor` class had incorrect position and ring setting calculations.

**Original Code**:
```javascript
forward(c) {
  const idx = mod(alphabet.indexOf(c) + this.position - this.ringSetting, 26);
  return this.wiring[idx];  // ❌ Missing final position adjustment
}
backward(c) {
  const idx = this.wiring.indexOf(c);
  return alphabet[mod(idx - this.position + this.ringSetting, 26)];  // ❌ Incorrect logic
}
```

**Fixed Code**:
```javascript
forward(c) {
  // Adjust for rotor position and ring setting
  const inputIdx = alphabet.indexOf(c);
  const adjustedIdx = mod(inputIdx + this.position - this.ringSetting, 26);
  const outputChar = this.wiring[adjustedIdx];
  // Adjust output back for position and ring setting
  const outputIdx = alphabet.indexOf(outputChar);
  const finalIdx = mod(outputIdx - this.position + this.ringSetting, 26);
  return alphabet[finalIdx];
}
backward(c) {
  // In backward direction, we need to reverse the wiring lookup
  const inputIdx = alphabet.indexOf(c);
  const adjustedIdx = mod(inputIdx + this.position - this.ringSetting, 26);
  const wiringChar = alphabet[adjustedIdx];
  const wiringIdx = this.wiring.indexOf(wiringChar);
  // Adjust output back for position and ring setting
  const finalIdx = mod(wiringIdx - this.position + this.ringSetting, 26);
  return alphabet[finalIdx];
}
```

**Impact**: Incorrect rotor calculations would cause the encryption to be completely wrong, especially when using non-zero rotor positions or ring settings.

## Summary

The main issues were:
1. **Plugboard symmetry**: Missing the second plugboard application
2. **Rotor stepping**: Incorrect double-stepping logic  
3. **Position calculations**: Wrong mathematical transformations for rotor positions

These fixes restore the correct Enigma machine behavior where:
- A message encrypted and then decrypted with the same settings returns the original text
- The machine properly handles plugboard pairs, rotor positions, and ring settings
- Rotor stepping follows the historical double-stepping pattern
- No character ever encrypts to itself (due to the reflector design)

## Testing Strategy

The comprehensive test suite covers:
- Basic encryption/decryption symmetry
- Single character processing
- Plugboard functionality
- Different rotor positions and ring settings
- Rotor stepping mechanics
- Long message processing
- Self-encryption prevention

All core functionality is tested to ensure at least 60% coverage as required. 
