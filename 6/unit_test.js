const { Enigma, Rotor } = require('./enigma.js');

// Test utilities
function testCase(name, testFunc) {
    try {
        const result = testFunc();
        console.log(`✓ ${name}: ${result ? 'PASS' : 'FAIL'}`);
        return result;
    } catch (error) {
        console.log(`✗ ${name}: ERROR - ${error.message}`);
        return false;
    }
}

// Test 1: Basic encryption/decryption symmetry
function testBasicSymmetry() {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const plaintext = 'HELLO';
    const encrypted = enigma1.process(plaintext);
    const decrypted = enigma2.process(encrypted);
    
    console.log(`  Plaintext: ${plaintext}`);
    console.log(`  Encrypted: ${encrypted}`);
    console.log(`  Decrypted: ${decrypted}`);
    
    return plaintext === decrypted;
}

// Test 2: Single character encryption/decryption
function testSingleChar() {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const plaintext = 'A';
    const encrypted = enigma1.process(plaintext);
    const decrypted = enigma2.process(encrypted);
    
    console.log(`  Single char: ${plaintext} -> ${encrypted} -> ${decrypted}`);
    
    return plaintext === decrypted && encrypted !== plaintext;
}

// Test 3: Plugboard functionality
function testPlugboard() {
    const plugPairs = [['A', 'B'], ['C', 'D']];
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugPairs);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugPairs);
    
    const plaintext = 'ABCD';
    const encrypted = enigma1.process(plaintext);
    const decrypted = enigma2.process(encrypted);
    
    console.log(`  With plugboard: ${plaintext} -> ${encrypted} -> ${decrypted}`);
    
    return plaintext === decrypted;
}

// Test 4: Different rotor positions
function testRotorPositions() {
    const enigma1 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
    const enigma2 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
    
    const plaintext = 'TESTING';
    const encrypted = enigma1.process(plaintext);
    const decrypted = enigma2.process(encrypted);
    
    console.log(`  Different positions: ${plaintext} -> ${encrypted} -> ${decrypted}`);
    
    return plaintext === decrypted;
}

// Test 5: Ring settings
function testRingSettings() {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [1, 2, 3], []);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [1, 2, 3], []);
    
    const plaintext = 'RINGSETTING';
    const encrypted = enigma1.process(plaintext);
    const decrypted = enigma2.process(encrypted);
    
    console.log(`  Ring settings: ${plaintext} -> ${encrypted} -> ${decrypted}`);
    
    return plaintext === decrypted;
}

// Test 6: Rotor stepping
function testRotorStepping() {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    // Test that rotors step correctly
    const initialPos = [enigma.rotors[0].position, enigma.rotors[1].position, enigma.rotors[2].position];
    enigma.process('A'); // This should step the rightmost rotor
    const afterOneStep = [enigma.rotors[0].position, enigma.rotors[1].position, enigma.rotors[2].position];
    
    console.log(`  Initial positions: [${initialPos.join(', ')}]`);
    console.log(`  After one step: [${afterOneStep.join(', ')}]`);
    
    return afterOneStep[2] === (initialPos[2] + 1) % 26;
}

// Test 7: Long message
function testLongMessage() {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const plaintext = 'THISISALONGERMESSAGETOTESTTHEROTSTEPPINGANDOVERALLSYSTEMSTABILITY';
    const encrypted = enigma1.process(plaintext);
    const decrypted = enigma2.process(encrypted);
    
    console.log(`  Long message length: ${plaintext.length}`);
    console.log(`  Match: ${plaintext === decrypted}`);
    
    return plaintext === decrypted;
}

// Test 8: No self-encryption (a letter should never encrypt to itself)
function testNoSelfEncryption() {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    let allDifferent = true;
    for (let i = 0; i < 26; i++) {
        const char = String.fromCharCode(65 + i); // A-Z
        const enigmaTest = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
        const encrypted = enigmaTest.process(char);
        if (encrypted === char) {
            console.log(`  Self-encryption detected: ${char} -> ${encrypted}`);
            allDifferent = false;
        }
    }
    
    return allDifferent;
}

// Main test runner
function runAllTests() {
    console.log('Running Enigma Machine Tests...\n');
    
    const tests = [
        ['Basic Encryption/Decryption Symmetry', testBasicSymmetry],
        ['Single Character Test', testSingleChar],
        ['Plugboard Functionality', testPlugboard],
        ['Different Rotor Positions', testRotorPositions],
        ['Ring Settings', testRingSettings],
        ['Rotor Stepping', testRotorStepping],
        ['Long Message', testLongMessage],
        ['No Self-Encryption', testNoSelfEncryption],
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const [name, testFunc] of tests) {
        if (testCase(name, testFunc)) {
            passed++;
        }
        console.log('');
    }
    
    console.log(`\nTest Results: ${passed}/${total} tests passed`);
    console.log(`Coverage: ${((passed / total) * 100).toFixed(1)}%`);
    
    return { passed, total, coverage: (passed / total) * 100 };
}

if (require.main === module) {
    runAllTests();
} 
