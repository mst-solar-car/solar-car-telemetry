var gulp = require('gulp'); 
var less = require('gulp-less'); 
var ts = require('gulp-typescript');


/**
 * Handle HTML
 */
gulp.task('html', function() {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest("./build"));
});

/**
 * Handle Javascript 
 */
gulp.task('javascript', function() {
  return gulp.src('./src/lib/**/*.js')
    .pipe(gulp.dest("./build/lib"));
});


/**
 * Compile less
 */
gulp.task('less', function() { 
  return gulp.src('./src/styles/**/*.less')
    .pipe(less())
    .pipe(gulp.dest("./build/styles"));
});


/**
 * Compile TypeScript
 */
gulp.task('typescript', function() { 
  var project = ts.createProject('tsconfig.json'); 

  var result = gulp.src('./src/**/*.ts')
    .pipe(project());

  return result.js.pipe(gulp.dest("./build"));
});


gulp.task('default', ['html', 'javascript', 'less', 'typescript']);