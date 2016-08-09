'use strict';

import gulp from 'gulp';
import webpack from 'webpack';
import path from 'path';
import rename from 'gulp-rename';
import template from 'gulp-template';
import yargs from 'yargs';
import gutil from 'gulp-util';
import serve from 'browser-sync';
import del from 'del';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import colorsSupported from 'supports-color';
import historyApiFallback from 'connect-history-api-fallback';

const root = 'client';
const resolveToApp = (glob = '') => path.join(root, 'app', glob);
const resolveToComponents = (glob = '') => path.join(root, 'app/components', glob);
const paths = {
    js: resolveToComponents('**/*!(.spec.js).js'), // exclude spec files
    styl: resolveToApp('**/*.styl'), // stylesheets
    html: [
        resolveToApp('**/*.html'),
        path.join(root, 'index.html')
    ],
    entry: [
        'babel-polyfill',
        path.join(__dirname, root, 'app/app.js')
    ],
    output: root,
    blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
    dest: path.join(__dirname, 'dist')
};

gulp.task('webpack', ['clean'], cb => {
    const config = require('./webpack.dist.config');
    config.entry.app = paths.entry;

    webpack(config, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);

        gutil.log('[webpack]', stats.toString({
            colors: colorsSupported,
            chunks: false,
            errorDetails: true
        }));

        cb();
    });
});

gulp.task('serve', () => {
    const config = require('./webpack.dev.config');
    config.entry.app = [
        // this modules required to make HRM working
        // it responsible for all this webpack magic
        'webpack-hot-middleware/client?reload=true',
        // application entry point
    ].concat(paths.entry);

    const compiler = webpack(config);
    serve({
        port: process.env.PORT || 3000,
        open: false,
        server: {baseDir: root},
        middleware: [
            historyApiFallback(),
            webpackDevMiddleware(compiler, {
                stats: {
                    colors: colorsSupported,
                    chunks: false,
                    modules: false
                },
                publicPath: config.output.publicPath
            }),
            webpackHotMiddleware(compiler)
        ]
    });
});

gulp.task('watch', ['serve']);

gulp.task('component', () => {
    const cap = val => val.charAt(0).toUpperCase() + val.slice(1);
    const name = yargs.argv.name;
    const parentPath = yargs.argv.parent || '';
    const destPath = path.join(resolveToComponents(), parentPath, name);

    return gulp.src(paths.blankTemplates)
    .pipe(template({
        name: name,
        upCaseName: cap(name)
    }))
    .pipe(rename(p => p.basename = path.basename.replace('temp', name)))
    .pipe(gulp.dest(destPath));
});

gulp.task('clean', cb => {
    del([paths.dest]).then(ps => {
        gutil.log('[clean]', ps);
        cb();
    });
});

gulp.task('default', ['watch']);
