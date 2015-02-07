var gulp    = require('gulp'),
gutil       = require('gulp-util'),
sass        = require('gulp-sass'),
browserify  = require('gulp-browserify'),
rename      = require('gulp-rename'),
jade        = require('gulp-jade'),
insert      = require('gulp-insert'),
dists       = require('./dist-scripts.json'),
io          = require('socket.io')(3000),
PrettyError = require('pretty-error'),
pe          = new PrettyError(),
firstTime   = false;

// Handle errors during watch

swallowError = function (error) {
	console.log(pe.render(error));
	this.emit('end');
}



// Socket refresh

io.on('connection', (function(_this) {
	return function(socket) {
		if (firstTime)
			return console.log('connected to app over port 3000');
		else
			return console.log('Client on port 3000 refreshed');
	};
})(this));


// Refresher Tasks

gulp.task('refresh-jade', ['jade'], function () {

	return io.emit("refresh", true);

});

gulp.task('refresh-coffee', ['coffee'], function () {

	return io.emit("refresh", true);

});

gulp.task('refresh-sass', ['sass'], function () {

	return io.emit("refresh", true);

});


// Basic Tasks

gulp.task('sass', function () {
	gulp.src('./development/**/*.sass')
	.pipe(sass({
		indentedSyntax: true,
		errLogToConsole: true,
		includePaths: ['./vendor/compass']
	}))
	.on('error', swallowError)
	.pipe(gulp.dest('./app/'));
});

gulp.task('coffee', function() {
	for (var i = dists.length - 1; i >= 0; i--) {

		src = dists[i];

		gulp.src('./development/**/' + src + '.coffee', { read: false })
		.pipe(browserify({
			// shim: {
			// 	angular: {
			// 		path: './vendor/angular/angular.min.js',
			// 		exports: 'angular'
			// 	},
			// 	'angular-route': {
			// 		path: './vendor/angular/angular-route.min.js',
			// 		exports: 'ngRoute',
			// 		depends: {
			// 			angular: 'angular'
			// 		}
			// 	},
			// 	jquery: {
			// 		path: './vendor/jquery/jquery.min.js',
			// 		exports: '$'
			// 	}
			// },
			transform: ['coffeeify'],
			extensions: ['.coffee']
		}))
		.on('error', swallowError)
		.pipe(rename(src + '.js'))
		.pipe(gulp.dest('./app/'))
	};

});

gulp.task('jade', function() {
	return gulp.src('./development/**/*.jade')
	.pipe(jade({
		pretty: true
	}))
	.on('error', swallowError)
	.pipe(insert.append('<script type="text/javascript" src="../refresh-client.js"></script>'))
	.pipe(gulp.dest('./app/'));
});

gulp.task('watch', function () {

	gulp.watch('./development/**/*.sass',['refresh-sass']);
	gulp.watch('./development/**/*.scss',['refresh-sass']);
	gulp.watch('./development/**/*.coffee',['refresh-coffee']);
	gulp.watch('./development/**/*.jade',['refresh-jade']);

});

// Default Task
gulp.task('default', ['coffee','sass','jade','watch']);