var sys  = require('sys'),
    http = require('http'),
    net  = require('net'),
    Optimizer = require('./lib/optimizer');


// on server start run optimizations
Optimizer.init();