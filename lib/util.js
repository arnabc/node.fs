
/**
 * Simple StringBuilder implementation
 * @class StringBuilder
 * @constructor
 * 
 * @param str
 */

function StringBuilder( str ){
    this.__buffer = [];

    if( str ) {
        this.__buffer.push( str );
    }

    Object.defineProperty( this, 'length', {
                               enumerable: false,
                               configurable: false,
                               get: function () {
                                   return this.__buffer.length;
                               }
                           } );
}

/**
 * Utility method to append string
 * @param str
 * @chainable
 * @return {StringBuilder}
 */
StringBuilder.prototype.append = function ( str ) {
    if( Array.isArray( str ) ) {
        Array.prototype.push.apply( this.__buffer, str );
        return this;
    }
    
    this.__buffer.push( str );
    return this;
}


/**
 * Method to remomve all the appended string fragments
 * @return {void}
 */
StringBuilder.prototype.clear = function () {
    this.__buffer.length = 0;
}

/**
 * Method to convert the string builder object into a string
 * @param sep - optional separator
 * @return {String}
 */
StringBuilder.prototype.toString = function ( sep ) {
    return this.__buffer.join( sep || '' );
}


// make it available
exports.StringBuilder = StringBuilder;