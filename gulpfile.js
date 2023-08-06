const { src, dest, series, parallel, watch } = require('gulp')
const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const cssnano = require('gulp-cssnano')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const kit = require('gulp-kit')
const sourcemaps = require('gulp-sourcemaps')
const clean = require('gulp-clean')
const browserSync = require('browser-sync').create()
const ghPages = require('gulp-gh-pages')
const reload = browserSync.reload

const paths = {
	html: './html/**/*.kit',
	sass: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	img: './src/img/*',
	dist: './dist',
	sassDist: './dist/css',
	jsDist: './dist/js',
	imgDist: './dist/img',
}

function sassCompiler(done) {
	src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDist))
	done()
}

function jsCompiler(done) {
	src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(uglify())
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDist))
	done()
}

function imgConvert(done) {
	src(paths.img).pipe(imagemin()).pipe(dest(paths.imgDist))
	done()
}

function handleKits(done) {
	src(paths.html).pipe(kit()).pipe(dest('./'))
	done()
}

function cleaning(done) {
	src(paths.dist, { read: false }).pipe(clean())
	done()
}

function browserSyncOn(done) {
	browserSync.init({
		server: {
			baseDir: './',
		},
	})
	done()
}

function watchChanges(done) {
	watch('./*.html').on('change', reload)
	watch([paths.html, paths.sass, paths.js], parallel(handleKits, sassCompiler, jsCompiler)).on('change', reload)
	watch(paths.img, imgConvert).on('change', reload)
	done()
}

gulp.task('deploy', function () {
	return gulp.src('./dist/**/*').pipe(ghPages())
})

const mainFunctions = parallel(handleKits, sassCompiler, jsCompiler, imgConvert)
exports.cleaning = cleaning
exports.default = series(mainFunctions, browserSyncOn, watchChanges)
