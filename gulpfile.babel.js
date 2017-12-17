import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import del from 'del';
import fileinclude from 'gulp-file-include';
import gulp from 'gulp';
import path from 'path';
import sass from 'gulp-sass';
import scsslint from 'gulp-scss-lint';
import sourcemaps from 'gulp-sourcemaps';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';

const paths = {
    files: {
        src: ['html/**/*.html', 'html/**/*.php'],
        dest: 'dist',
    },
    fonts: {
        src: ['html/fonts/**/*'],
        dest: 'dist/css/fonts',
    },
    images: {
        src: ['html/images/**/*'],
        dest: 'dist/images',
    },
    scripts: {
        dest: 'dist/bundle.js',
    },
    styles: {
        src: ['html/scss/*.scss'],
        lint: ['html/scss/**/*.scss', '!html/scss/partials/_reset.scss'],
        dest: 'dist/css',
    }
};

const browser = browserSync.create();
const bundler = webpack(webpackConfig);

const clean = () => del(paths.files.dest);

function serve() {
    browser.init({
        server: {
            baseDir: paths.files.dest
        },
        middleware: [
            webpackDevMiddleware(bundler),
        ],
    });

    gulp.watch('html/scss/**/*.scss', gulp.series(styles, stylesLint));

    gulp.watch(paths.fonts.src, fonts)
        .on('change', () => browser.reload());

    gulp.watch(paths.images.src, images)
        .on('change', () => browser.reload());

    gulp.watch(paths.files.src, files)
        .on('change', () => browser.reload());

    gulp.watch('html/js/**/*.js')
        .on('change', () => browser.reload());
}

function files() {
    return gulp.src(paths.files.src)
        .pipe(fileinclude())
        .pipe(gulp.dest(paths.files.dest));
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

function scripts() {
    return new Promise(resolve => webpack(webpackConfig,
        (err, stats) => {
            if (err) console.log('Webpack', err)
            console.log(stats.toString({ /* stats options */ }));
            resolve();
        }));
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browser.stream());
}

function stylesLint() {
    return gulp.src(paths.styles.lint)
        .pipe(scsslint());
}

export const build = gulp.series(clean, scripts, styles, files, images, fonts);
export const dev = gulp.series(build, stylesLint, serve);
export default build;
