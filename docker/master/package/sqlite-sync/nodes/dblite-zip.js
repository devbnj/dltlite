module.exports = function(RED) {
    var pako = require('pako');
    var txtd = require('text-encoding');

    function GzipNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        this.on("input", function(msg) {
            if (msg.hasOwnProperty("payload")) {
                if (typeof msg.payload === "object") {
                    try {
                        var out = pako.inflate(msg.payload);
                        // msg.payload = new txtd.TextDecoder('utf-8').decode(out);
                        msg.payload = out;
                        node.send(msg);
                    } catch(e) {
                      node.error(e, msg);
                    }
                } else if (typeof msg.payload === "string") {
                    try {
                        var out = pako.deflate(msg.payload);
                        msg.payload = out;
                        node.send(msg);
                    } catch(e) {
                        node.error(e, msg);
                    }
                } else {
                    node.error('dropped', msg);
                }
            } else {
              // If no payload - just pass it on.
              node.send(msg);
            }
        });
    }
    RED.nodes.registerType("dbliteZip", GzipNode);
}