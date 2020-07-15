const cpus = require('os').cpus().length, cluster = require('cluster')
const { app, run } = require('./index');

if(cluster.isMaster) {
    for(let server = 0; server < cpus; server++) {
        cluster.fork()
    }
}

else {
    run(app)
}