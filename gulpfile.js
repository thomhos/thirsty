'use strict';

/*
 *  Require plugins
 */

var autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    csscomb       = require('gulp-csscomb'),
    del           = require('del'),
    fileinclude   = require('gulp-file-include'),
    gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    gzip          = require('gulp-gzip'),
    htmlmin       = require('gulp-htmlmin'),
    ifelse        = require('gulp-if-else'),
    imagemin      = require('gulp-imagemin'),
    jshint        = require('gulp-jshint'),
    livereload    = require('gulp-livereload'),
    minifycss     = require('gulp-minify-css'),
    minifyhtml    = require('gulp-minify-html'),
    mustache      = require("gulp-mustache-plus"),
    notify        = require('gulp-notify'),
    rev           = require('gulp-rev'),
    sass          = require('gulp-sass'),
    sassbulk      = require('gulp-sass-bulk-import'),
    server        = require('gulp-server-livereload'),
    tap           = require('gulp-tap'),
    sourcemaps    = require('gulp-sourcemaps'),
    uglify        = require('gulp-uglify'),
    webp          = require('gulp-webp');



/*
 *  Set environment object
 */



var env = {
  'type':         'development',
  'localserver':  'localhost',
  'localport':    '8000'
};



/*
 *  Gulp environment task: bamboo
 *
 *  Task for the continuous integration tool Bamboo.
 *  It first empties the entire ./build folder,
 *  on callback it runs the `build` task.
 *
 *  This will set the environment type to 'production'.
 */

gulp.task('bamboo', function() {

  // Set environment type to `production`
  env.type = 'production';

  // Clean current files and run `build`
  del(['./build/**/*'], function (err, paths) {
    gulp.start('build');
   });

});



/*
 *  Gulp environment task: build
 *
 *  Build the entire project to the 'build' folder, ready for deployed
 *  via backend or git.
 *
 *  This will set the environment type to 'production'.
 */

gulp.task('build', function() {

  // Set environment type to `production`
  env.type = 'production';

  // Build files
  gulp.start('fonts');
  gulp.start('html');
  gulp.start('images');
  gulp.start('js');
  gulp.start('sass');

  /*
   *  Currently disabled for this project
   */

  // Optimize build files
  //gulp.start('css-minify');
  //gulp.start('gzip');
  //gulp.start('webp');

});



/*
 *  Gulp environment task: clean
 *
 *  Delete all files which are being build via gulp.
 *
 */

gulp.task('clean', function() {

  del(['./build/**/*.html', './build/css', './build/fonts', './build/img', './build/js'], function (err, paths) {
    console.log('Deleted files/folders:\n', paths.join('\n'));
  });

});



/*
 *  Gulp environment task: default
 *
 *  Default task when executing the 'gulp' command, it will run all secundairy
 *  tasks in a development environment. Like a one-time 'gulp watch'.
 */

gulp.task('default', function() {

  gulp.start('fonts');
  gulp.start('html');
  gulp.start('images');
  gulp.start('js');
  gulp.start('sass');
  //gulp.start('webp');

});



/*
 *  Gulp environment task: server
 *
 *  Starts a server.
 *
 *  This includes the watch task and livereload.
 */

gulp.task('server', function() {

  gulp.start('watch');

  gulp.src('build')
    .pipe(server(
      {
        host:         env.localserver,
        port:         env.localport,
        livereload:   true,
        open:         true,
        defaultFile:  'index.html'
      }
    ));

});



/*
 *  Gulp environment task: watch
 *
 *  Default command 'gulp watch' which is normally being used during
 *  development of the project. It will watch all files and runs the commands
 *  on all of the files.
 *
 *  This includes jslinting and sourcemap.
 */

gulp.task('watch', function() {

  // Watch font files
  gulp.watch('./fonts/**/*', ['fonts']);

  // Watch image files
  gulp.watch('./images/**/*', ['images']);

  // Watch .js files
  gulp.watch('./js/**/*.js', ['js']);

  // Watch html files
  gulp.watch('./html/**/*', ['html']);

  // Watch .scss files
  gulp.watch('./sass/**/*.scss', ['sass']);

});



/*
 *  Gulp task: css-minify
 *
 *  Minify all build css files for optimalisation.
 *
 *  This includes removing all comments.
 *
 */

gulp.task('css-minify', function() {

  gulp.src('./build/**/*.css')

    .pipe(minifycss({keepSpecialComments: 0}))

    .pipe(gulp.dest('./build'))

    .pipe(
      ifelse(env.type === 'development', function () {
        return notify({ message: 'css-minify task complete' });
      })
    );

});



/*
 *  Gulp task: fonts
 *
 *  Pipe all font files to the build folder.
 *
 *  This includes caching.
 *
 */

gulp.task('fonts', function() {

  gulp.src('./fonts/**/*')

    .pipe(gulp.dest('./build/css/fonts'))

    .pipe(
      ifelse(env.type === 'development', function () {
        return notify({ message: 'font task complete' });
      })
    )

    .pipe(livereload());

});



/*
 *  Gulp task: gzip
 *
 *  gzip all css and js files within the build folder.
 *
 */

gulp.task('gzip', function() {

  gulp.src('./build/css/**/*.css')

    .pipe(gzip())

    .pipe(gulp.dest('./build/css'))

    .pipe(
      ifelse(env.type === 'development', function () {
        return notify({ message: 'gzip css task complete' });
      })
    );

  gulp.src('./build/js/**/*.js')

    .pipe(gzip())

    .pipe(gulp.dest('./build/js'))

    .pipe(
      ifelse(env.type === 'development', function () {
        return notify({ message: 'gzip js task complete' });
      })
    );

});



/*
 *  Gulp task: html
 *
 *  Pipe all html files to the build folder.
 *
 *  This includes fileinclude and htmlmin, of which settings can be
 *  checked on: https://www.npmjs.com/package/html-minifier
 *
 */

gulp.task('html', function() {

  gulp.src(['./html/**/*.html'])

    .pipe(tap(function (file,t) {

        return gulp.src(file.path)

          .pipe(fileinclude({
            prefix: '@@'
          }))

          .on('error', gutil.log)

          /*
           *    Disabled mustache for this project

                .pipe(mustache(
                  "./html/data/page-" + file.relative
                )

          */

          .on('error', gutil.log)

          .pipe(gulp.dest('./build'));
    }))

    .pipe(
      ifelse(env.type === 'development', function () {
        return notify({ message: 'html task complete' });
      })
    );


    /*
     *  Currently disabled for this project
     */

    //.pipe(htmlmin({
    //  collapseWhitespace: true,
    //  minifyCSS: true,
    //  minifyJS: true,
    //  minifyURLs: true,
    //  removeComments: true,
    //  removeEmptyAttributes: true,
    //  removeScriptTypeAttributes: true,
    //  removeStyleLinkTypeAttributes: true,
    //  useShortDoctype: true
    //}))

});



/*
 *  Gulp task: images
 *
 *  Pipe all image files to the build folder.
 *
 *  This includes caching, interlaced, multipass, progressive.
 *  The level op optimization is set to 3, which is default.
 *
 */

gulp.task('images', function() {

  gulp.src(['./images/**/*'])

    .pipe(
      imagemin({
          interlaced: true ,
          multipass : true,
          optimizationLevel: 3,
          progressive: true
      })
    )

    .pipe(gulp.dest('./build/images'))

    .pipe(
      ifelse(env.type === 'development', function () {
        return notify({ message: 'image task complete' });
      })
    )

    .pipe(livereload());

});



/*
 *  Gulp task: js
 *
 *  Pipe all .js files to the build folder.
 *  Filtered to those only directly in je js folder.
 *
 *  This includes jshint and uglify.
 *  When in 'development' mode, it will also pipe sourcemap.
 *
 *  The task will concat in the following order:
 *    - modernizr.js
 *    - jquery.js
 *    - all other .js files from the ./js folder
 *
 */

gulp.task('js', function() {

  gulp.src(['./js/vendor/**/*.js', './js/**/*.js'])

    .pipe(
      ifelse(env.type === 'development', sourcemaps.init)
    )

    .pipe(concat('main.js'))

    .pipe(
      ifelse(env.type === 'development', jshint)
    )

    .pipe(jshint.reporter('default'))



    /*
     *  Currently disabled for this project
     */

    //.pipe(
    //  ifelse(env.type === 'production', uglify)
    //)

    .pipe(
      ifelse(env.type === 'development', sourcemaps.write)
    )

    .pipe(gulp.dest('./build/js'))

    .pipe(
      ifelse(env.type === 'development', function () {
        return notify({ message: 'js task complete' });
      })
    )

    .pipe(livereload());

});



/*
 *  Gulp task: sass
 *
 *  Pipe all .scss files to the build folder.
 *
 *  This includes sourcemap, autoprfix and cssbomb.
 *  When in 'production' mode, it will also pipe csscomb.
 */

gulp.task('sass', function() {

  gulp.src([
    './sass/*.scss'
  ])

  //gulp.src('./sass/*.scss')

    .pipe(
      ifelse(env.type === 'development', sourcemaps.init)
    )
    .pipe(sassbulk())

    .pipe(sass({
      precision: 10,
      outputStyle: 'nested',
      errLogToConsole: true
    }))
    .on('error', gutil.log)

    .pipe(autoprefixer('last 2 version'))

    .pipe(
      ifelse(env.type === 'production', csscomb)
    )

    .pipe(
      ifelse(env.type === 'development', sourcemaps.write)
    )

    .pipe(gulp.dest('./build/css'))

    .pipe(
      ifelse(env.type === 'development', function () {
        return notify({ message: 'sass task complete' });
      })
    )

    .pipe(livereload());

});



/*
 *  Gulp task: webp convertion
 *
 *  Pipe all image files to the webp format and send them to the build folder.
 */

gulp.task('webp', function() {

  gulp.src('./img/**/*')

    .pipe(webp())

    .pipe(gulp.dest('./build/img'))

    .pipe(
      ifelse(env.type === 'development', function () {
        return notify({ message: 'webp task complete' });
      })
    )

    .pipe(livereload());

});
