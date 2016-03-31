/// <reference path="typings/gulp/gulp.d.ts"/>
/// <reference path="typings/gulp-typescript/gulp-typescript.d.ts"/>

var gulp = require('gulp');
var del = require('del');
var gulpTypescript = require('gulp-typescript');

var consts = {};
consts.ReleaseFolder = 'release/';
consts.SourceFolder = "src/";
consts.JavascripOutputFolder = consts.ReleaseFolder + "js";
consts.CssOutputFolder = consts.ReleaseFolder + "css";

gulp.task('client-js', ['cleanBuild'], function() {
    var tsResult = gulp.src(consts.SourceFolder + 'js/**/*.ts').pipe(gulpTypescript({
                           target: "ES5",
                           declarationFiles: false,
                           noExternalResolve: true,
                           removeComments: true,
                           out: "shotRock.js"
                       }));

    return tsResult.js.pipe(gulp.dest(consts.JavascripOutputFolder));
});

gulp.task('htmlCopy', ['cleanBuild'], function() {
    return gulp.src(consts.SourceFolder + 'index.html').pipe(gulp.dest(consts.ReleaseFolder));
});

gulp.task('cssCopy', ['cleanBuild'], function() {
    return gulp.src(consts.SourceFolder + 'css/**/*').pipe(gulp.dest(consts.CssOutputFolder));
});

gulp.task('clean', function(callBack) {
    return del([consts.ReleaseFolder+'/**/*'], callBack);
});

gulp.task('cleanBuild', ['clean']);

gulp.task('default', ['cleanBuild', 'client-js', 'htmlCopy', 'cssCopy']);
