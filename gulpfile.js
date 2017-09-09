var gulp = require('gulp'),
    notify = require("gulp-notify"),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    clean = require('gulp-dest-clean'),
    gulpSequence = require('gulp-sequence'),
    browserSync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include');

// Bootstrap scss source
var bootstrapSass = {
        in: './node_modules/bootstrap-sass/'
    };


/* File includes */
gulp.task('html', function() {
  gulp.src('./dev/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./prod/'))
    .pipe(notify({ message: 'HTML task complete' }))
    .pipe(browserSync.reload({stream: true})); 
});

/* Compile SASS */
gulp.task('styles', function () {
  return gulp.src('./dev/sass/**/*.scss')
    .pipe(sass({
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
        }).on('error', sass.logError))
    // .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('./prod/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(csso())
    .pipe(gulp.dest('./prod/css'))
    .pipe(notify({ message: 'Styles task complete' }))
    .pipe(browserSync.reload({stream: true}));
});

/* Compile JS */
gulp.task('scripts', function() {
    return gulp.src(['./dev/js/*.js'])
        .pipe(gulp.dest('./prod/js/'))
        .pipe(concat('main.js'))
        // .pipe(gulp.dest('./prod/js/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./prod/js/'))
        .pipe(notify({ message: 'Scripts task complete' }))
        .pipe(browserSync.reload({stream: true}));
});


/* Commpress Image */
gulp.task('images', () =>
    gulp.src('./dev/img/*')
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
            ],
            {verbose: true})))
        .pipe(gulp.dest('./prod/img'))
        .pipe(notify({ message: 'Images task complete' }))
        .pipe(browserSync.reload({stream: true}))
);

/* Fonts Prod Dir */
gulp.task('fonts', function() {
    // gulp.src( ['./dev/fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'])
    gulp.src( ['./dev/fonts/*.*'])
    .pipe(gulp.dest('./prod/fonts'));
});

/* Временный таск */
gulp.task('my_css', function() {
    gulp.src( ['./dev/css/*.*'])
    .pipe(gulp.dest('./prod/css'));
});

/* Clean Prod Dir */
gulp.task('clean', function() {
 return gulp.src('./dev')
 .pipe(clean('./prod'));
});

/* Browser-sync Static server */
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./prod/"
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "Frontend_Nitch"
    });
});


/* Watcher */
gulp.task('watch', ['browser-sync'], function() {    
    gulp.watch('./dev/sass/**/*.scss', ['styles']);
    gulp.watch('./dev//**/*.html', ['html']);
    gulp.watch('./dev/js/main.js', ['scripts']);
    // gulp.watch('./dev/img/*.*', ['images']);
    // gulp.watch("*.html").on("change", browserSync.reload);
});

/* Build Task*/
gulp.task('build', gulpSequence('clean', 'fonts', 'html', 'styles', 'scripts', 'images', 'my_css' ));

/* DEFAULT Build Task*/
gulp.task('default', gulpSequence('build', 'watch'));
