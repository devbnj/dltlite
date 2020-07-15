// var fs = require("fs");

module.exports = {
    uiPort: process.env.PORT || 2880,
    //uiHost: "127.0.0.1",
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    //socketReconnectTime: 10000,
    //socketTimeout: 120000,
    //tcpMsgQueueSize: 2000,
    //httpRequestTimeout: 120000,
    debugMaxLength: 1000,
    //nodeMaxMessageBufferLength: 0,
    //tlsConfigDisableLocalFiles: true,
    //debugUseColors: true,

    //flowFile: 'flows_master.json',

    //flowFilePretty: true,
    //credentialSecret: "a-secret-key",
    //userDir: '/home/nol/.node-red/',
    //nodesDir: '/home/nol/.node-red/nodes',
    //httpAdminRoot: '/admin',

    //httpNodeRoot: '/red-nodes',
    //httpRoot: '/datanox',
    //httpStatic: '/home/nol/node-red-static/',
    //apiMaxLength: '5mb',

    //ui: { path: "ui" },

    //adminAuth: {
    //    type: "credentials",
    //    users: [{
    //        username: "admindb",
    //        password: "$2a$08$hnUoV8.ggJoUMlzOuskk6e8tTlYLj7GqqkQwyWf0F3qJoDvZNZjXe",
    //        permissions: "*"
    //    }]
    //},

    //httpNodeAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},
    //httpStaticAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},

    //https: {
    //    key: fs.readFileSync('privatekey.pem'),
    //    cert: fs.readFileSync('certificate.pem')
    //},

    //requireHttps: true,

    //disableEditor: false,

    //httpNodeCors: {
    //    origin: "*",
    //    methods: "GET,PUT,POST,DELETE"
    //},

    //httpNodeMiddleware: function(req,res,next) {
    //    // Handle/reject the request, or pass it on to the http in node by calling next();
    //    // Optionally skip our rawBodyParser by setting this to true;
    //    //req.skipRawBodyParser = true;
    //    next();
    //},

    //httpServerOptions: { },

    //webSocketNodeVerifyClient: function(info) {
    //    // 'info' has three properties:
    //    //   - origin : the value in the Origin header
    //    //   - req : the HTTP request
    //    //   - secure : true if req.connection.authorized or req.connection.encrypted is set
    //    //
    //    // The function should return true if the connection should be accepted, false otherwise.
    //    //
    //    // Alternatively, if this function is defined to accept a second argument, callback,
    //    // it can be used to verify the client asynchronously.
    //    // The callback takes three arguments:
    //    //   - result : boolean, whether to accept the connection or not
    //    //   - code : if result is false, the HTTP error status to return
    //    //   - reason: if result is false, the HTTP reason string to return
    //},

    // The following property can be used to seed Global Context with predefined
    // values. This allows extra node modules to be made available with the
    // Function node.
    // For example,
    //    functionGlobalContext: { os:require('os') }
    // can be accessed in a function block as:
    //    global.get("os")
    functionGlobalContext: {
        // os:require('os'),
        // jfive:require("johnny-five"),
        // j5board:require("johnny-five").Board({repl:false})
	    fsv: require("fs"),
        hashnsalt:require("./mod/hashnsalt.js"),
        dlcrypto:require("./mod/dlcrypto.js"),
        dblite3:require("sqlite3")
        // tcode:require("text-encoding")
    },
    // `global.keys()` returns a list of all properties set in global context.
    // This allows them to be displayed in the Context Sidebar within the editor.
    // In some circumstances it is not desirable to expose them to the editor. The
    // following property can be used to hide any property set in `functionGlobalContext`
    // from being list by `global.keys()`.
    // By default, the property is set to false to avoid accidental exposure of
    // their values. Setting this to true will cause the keys to be listed.
    exportGlobalContextKeys: false,


    // Context Storage
    // The following property can be used to enable context storage. The configuration
    // provided here will enable file-based context that flushes to disk every 30 seconds.
    // Refer to the documentation for further options: https://nodered.org/docs/api/context/
    //
    //contextStorage: {
    //    default: {
    //        module:"localfilesystem"
    //    },
    //},

    // The following property can be used to order the categories in the editor
    // palette. If a node's category is not in the list, the category will get
    // added to the end of the palette.
    // If not set, the following default order is used:
    //paletteCategories: ['subflows', 'input', 'output', 'function', 'social', 'mobile', 'storage', 'analysis', 'advanced'],

    // Configure the logging output
    logging: {
        // Only console logging is currently supported
        console: {
            // Level of logging to be recorded. Options are:
            // fatal - only those errors which make the application unusable should be recorded
            // error - record errors which are deemed fatal for a particular request + fatal errors
            // warn - record problems which are non fatal + errors + fatal errors
            // info - record information about the general running of the application + warn + error + fatal errors
            // debug - record information which is more verbose than info + info + warn + error + fatal errors
            // trace - record very detailed logging + debug + info + warn + error + fatal errors
            // off - turn off all logging (doesn't affect metrics or audit)
            level: "info",
            // Whether or not to include metric events in the log output
            metrics: false,
            // Whether or not to include audit events in the log output
            audit: false
        }
    },

    // Customising the editor
    editorTheme: {
        projects: {
            // To enable the Projects feature, set this value to true
            enabled: false
        }
    }
}
