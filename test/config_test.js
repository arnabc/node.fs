var sys = require('sys'),
    assert = require('assert'),
    Config = require('./../config/config');


// tests whether it is extensible or not
assert.equal( Object.isExtensible( Config ), false, 'The object should not be extensible after it is frozen' );

// tests if the object is frozen or not
assert.equal( Object.isFrozen( Config ), true, 'The object should not be editable once frozen' );


// basic Object property testing
var pd = Object.getOwnPropertyDescriptor( Config, 'CSS' );
assert.equal( pd.writable, false, 'The "CSS" property of the Config object should not be writable' );

try {
    // in node.js setting value fo frozen properties does not throw error and also does not set the value too
    assert.throws( function () {
        pd.writable = true;
    }, 'object is not extensible' );

} catch(e) {
    assert.ok( /object is not extensible/.test(e) );
}