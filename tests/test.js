/**
 * Simple test suite for the Roulette application
 * 
 * This file contains tests for the RouletteStorage class functionality.
 * To run these tests, include this file in a test HTML page and check the console output.
 */

// Test suite for RouletteStorage
function testRouletteStorage() {
    console.log('Running RouletteStorage tests...');
    
    // Clear any existing data
    localStorage.clear();
    
    // Create a new instance of RouletteStorage
    const testStorage = new RouletteStorage();
    
    // Test saving and retrieving names
    const testNames = ['Test1', 'Test2', 'Test3'];
    testStorage.saveNames(testNames);
    
    const retrievedNames = testStorage.getNames();
    console.assert(
        JSON.stringify(retrievedNames) === JSON.stringify(testNames),
        'Names retrieval test failed'
    );
    console.log('Names storage test passed');
    
    // Test history functionality
    const testEntry1 = { name: 'Winner1', timestamp: '2023-01-01 12:00:00' };
    const testEntry2 = { name: 'Winner2', timestamp: '2023-01-01 12:05:00' };
    
    testStorage.addHistoryEntry(testEntry1);
    testStorage.addHistoryEntry(testEntry2);
    
    const history = testStorage.getHistory();
    
    console.assert(
        history.length === 2,
        `History length test failed. Expected 2, got ${history.length}`
    );
    
    console.assert(
        history[0].name === testEntry2.name,
        'History order test failed. Most recent entry should be first.'
    );
    
    console.log('History storage test passed');
    
    // Test history limit
    for (let i = 0; i < 15; i++) {
        testStorage.addHistoryEntry({ 
            name: `ExtraWinner${i}`, 
            timestamp: `2023-01-01 13:0${i}:00` 
        });
    }
    
    const limitedHistory = testStorage.getHistory();
    console.assert(
        limitedHistory.length === 10,
        `History limit test failed. Expected 10, got ${limitedHistory.length}`
    );
    
    console.log('History limit test passed');
    
    // Test clearing functionality
    testStorage.clearHistory();
    console.assert(
        testStorage.getHistory().length === 0,
        'Clear history test failed'
    );
    
    testStorage.clearNames();
    console.assert(
        testStorage.getNames().length === 0,
        'Clear names test failed'
    );
    
    console.log('Clear functionality test passed');
    
    console.log('All RouletteStorage tests completed successfully!');
}

// Run tests when included in a test page
if (typeof window !== 'undefined' && window.runTests) {
    testRouletteStorage();
}