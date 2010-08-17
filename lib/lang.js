// string utilities borrowed from Prototype JavaScript Library ( http://prototypejs.org/ )

// method startsWith
// 'Prototype Library'.startsWith( 'Pro' ); => true
String.prototype.startsWith = String.prototype.startsWith || function ( pattern ) {
    // We use `lastIndexOf` instead of `indexOf` to avoid tying execution
    // time to string length when string doesn't start with pattern.
    return this.lastIndexOf(pattern, 0) === 0;
}

// method endsWith
// 'Prototype Library'.endssWith( 'ary' ); => true
String.prototype.endsWith = String.prototype.endsWith || function ( pattern ) {
    var d = this.length - pattern.length;
    // We use `indexOf` instead of `lastIndexOf` to avoid tying execution
    // time to string length when string doesn't end with pattern.
    return d >= 0 && this.indexOf(pattern, d) === d;
}
// --------------------------------------------------------------------------------------------