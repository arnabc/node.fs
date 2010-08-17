// a simple wildcard parser based on http://www.codeproject.com/KB/recipes/wildcardtoregex.aspx

/**
 * Utility class converts wildcard strings to RegExp
 *
 * @class Wildcard
 * @constructor
 * @param pattern
 */
function Wildcard( pattern ) {
    var re = Wildcard.escape( pattern )
                .replace(/\\\*/g, '.*' )
                .replace( /\\\?/g, '.' ) + '$';

    this.wildcardRe = new RegExp( re );
}

// generic toString method
Wildcard.prototype.toString = function () {
    return this.wildcardRe;
}

// takes an input string and performs a match with
// the specified string, returns the match else null
Wildcard.prototype.match = function ( inp ) {
    return this.wildcardRe.exec( inp );    
}


// THE FOLLOWING METHOD IS BORROWED FROM xRegExp library, for more info on how to use that library
// please check out http://xregexp.com/

// Accepts a string; returns the string with regex metacharacters escaped. The returned string
// can safely be used at any point within a regex to match the provided literal string. Escaped
// characters are [ ] { } ( ) * + ? - . , \ ^ $ | # and whitespace
Wildcard.escape = function ( str ) {
    return str.replace( /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&" );
}


// export
exports.Wildcard = Wildcard;