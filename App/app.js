'use strict'

var configEnv = require("./config");

var express                 = require('express'),
    bp                      = require('body-parser'),
    path                    = require('path'),
    compression             = require('compression'),
    webpack                 = require('webpack'),
    webpackDevMiddleware    = require('webpack-dev-middleware'),
    webpackHotMiddleware    = require('webpack-hot-middleware'),
    config                  = require('./webpack.base.config')

const app                   = express(),
    DIST_DIR                = path.join(__dirname, 'dist'),
    HTML_FILE               = path.join(DIST_DIR, 'index.html'),
    isDev                   = process.env.NODE_ENV !== 'production',
    DEFAULT_PORT            = 3500,
    compiler                = webpack(config)

app.set('port', process.env.PORT || DEFAULT_PORT)
app.use(bp.json())
app.use(compression())


if (configEnv.env == 'production') {
    app.use(function(req, res, next) {
        if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
            res.redirect('https://' + req.get('Host') + req.url);
        }
        else
            next();
    });
}

require('./server/config/routes.js')(app)

if (isDev) {
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }))

    app.use(webpackHotMiddleware(compiler))

    app.get('*', (req, res, next) => {
        compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
            if (err) {
                return next(err)
            }
            res.set('content-type', 'text/html')
            res.send(result)
            res.end
        })
    })
} else {
    app.use(express.static(DIST_DIR))
    app.get('*', (req, res) => res.sendFile(HTML_FILE))
}


app.listen(app.get('port'), () => {
    console.log('Listening on port ' + app.get('port'))
})
