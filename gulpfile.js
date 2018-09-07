var gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    sassGlob = require("gulp-sass-glob"),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    csscomb = require('gulp-csscomb'),
    pleeease = require('gulp-pleeease'),
    cache = require('gulp-cached'),
    del = require('del'),
    runSequence = require('run-sequence'),
    minimist = require("minimist");

var option = minimist(process.argv.slice(2));
var plumberOptions = {
  errorHandler: function (error) { 
    console.log(error.messageFormatted);
    this.emit('end');
  }
};

// 削除
gulp.task('clean', del.bind(null, ['dist']));

//Pug出力タスク
gulp.task('pug', () => {
  return gulp.src(['./src/pug/page/**/**/*.pug'],{base: './src/pug/page/'})
    .pipe(cache('pug'))
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('./dist/'));
});

//Sass出力タスク
gulp.task('scss', () => {
  return gulp.src('./src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(pleeease({
      "autoprefixer": true,
      "minifier": false,
      "mqpacker": true
    }))
    .pipe(sourcemaps.write('../maps/'))
    .pipe(gulp.dest('./dist/css/'))
});

gulp.task('img', function () {
  return gulp.src(['./src/images/**/*', './src/favicon.ico'], { base: './src' })
  .pipe(gulp.dest('./dist'));
});

gulp.task('js', function () {
  return gulp.src('./src/js/**/*', { base: './src' })
  .pipe(gulp.dest('./dist'));
});

gulp.task('json', function () {
  return gulp.src('./src/json/*', { base: './src' })
  .pipe(gulp.dest('./dist'));
});

gulp.task('vendor', function () {
  return gulp.src('./src/vendor/**/*', { base: './src' })
  .pipe(gulp.dest('./dist'));
});

gulp.task('others', function () {
  return gulp.src(['./src/others/**/*','./src/sitemap.xml'], { base: './src' })
  .pipe(gulp.dest('./dist'));
});


if(option.dev == 'production'){
  gulp.task('build', function(){
    return runSequence(
      'clean',
      ['pug', 'scss', 'img', 'js', 'json' ,'vendor','others'],
    );
  });
}else if(option.dev == 'development'){
  gulp.task('build', ['pug', 'scss', 'img', 'js', 'json' ,'vendor','others']);
}

gulp.task("default",['build'], function() {
  if(option.dev == 'development'){
    gulp.watch("src/pug/page/**/**/*",["pug"]);
    gulp.watch('src/scss/**/*.scss', ['scss']);
    gulp.watch('src/js/**/*', ['js']);
    gulp.watch('src/json/*', ['json']);
    gulp.watch('src/images/**/*', ['img']);
  }
});
