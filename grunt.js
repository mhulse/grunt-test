/* global module: false */

/**
 * @todo Setup banners.
 * @see https://github.com/cowboy/grunt/blob/master/docs/task_min.md#banner-comments
 */

module.exports = function(grunt) {
	
	var SRC = 'src'
	STAGING = 'intermediate',
	OUTPUT  = 'publish';
	
	// default   # concat css min img rev usemin manifest
	// text      # concat css min     rev usemin manifest
	// buildkit  # concat css min img rev usemin manifest html:buildkit
	// basics    # concat css min img rev usemin manifest html:basics
	// minify    # concat css min img rev usemin manifest html:compress
	
	// https://github.com/h5bp/node-build-script/issues/50#issuecomment-7032276
	// intro clean mkdirs concat css min img rev usemin manifest copy time
	
	grunt.initConfig({
		
		// Get ready... FIGHT!
		
		/*--------------------------------------------------------------------*/
		
		pkg : '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		
		//----------------------------------
		
		staging: STAGING,
		output: OUTPUT,
		
		/*----------------------------------( 0 )----------------------------------*/
		
		/**
		 * Kindly inform the developer about the impending magic.
		 */
		
		//intro: {},
		
		/*----------------------------------( 1 )----------------------------------*/
		
		/**
		 * Task `clean` (required) wipes the previous build dirs.
		 */
		
		//clean: {},
		
		/*----------------------------------( 2 )----------------------------------*/
		
		/**
		 * Task `mkdirs` prepares the build dirs.
		 * 
		 * @task fresh
		 * @dependency `clean`
		 */
		
		mkdirs: {
			staging: SRC
		},
		
		/*----------------------------------( 2 )----------------------------------*/
		
		/**
		 * LESS task for grunt.
		 *
		 * @see lesscss.org
		 */
		
		less: {
			css: {
				src: [
					STAGING + '/css/less/less.less'
				],
				dest: STAGING + '/css/app/less.css'
			}
		},
		
		/*----------------------------------( 3 )----------------------------------*/
		
		/**
		 * Task `concat` is a built-in file concatenation grunt task.
		 */
		
		concat: {
			/*
			css : {
				src : [
					STAGING + '/css/libs/*.css',
					SRC_CSS + '/css/app/*.css'
				],
				dest : BUILD_CSS + '/css/' + STAGING + '.css'
			},
			*/
			js: {
				src: [
					STAGING + '/js/libs/jquery-*.js',
					STAGING + '/js/app/first.js',
					STAGING + '/js/app/second.js'
				],
				dest: STAGING + '/js/app/' + STAGING + '.js'
			}
		},
		
		/*----------------------------------( 4 )----------------------------------*/
		
		/**
		 * Task `cssmin` used to combine and minify CSS.
		 * Note: Does not inline `@import`s.
		 */
		
		cssmin : {
			css : {
				src: [
					STAGING + '/css/libs/*.css',
					STAGING + '/css/app/*.css'
				],
				//dest: STAGING + '/css/<%= pkg.name %>-<%= pkg.version %>.min.css'
				dest: STAGING + '/css/<%= pkg.name %>.css'
			}
		},
		
		/**
		 * Task `css` will concatenate files, inline `@import`s and output a single minified CSS file.
		 */
		
		/*
		css: {
			'publish/css/style.css': [ 'css/style.css' ]
		},
		*/
		
		/*----------------------------------( 5 )----------------------------------*/
		
		/**
		 * Task `min` used to minify files using UglifyJS.
		 *
		 * @see github.com/mishoo/UglifyJS/
		 */
		
		min: {
			js: {
				src: '<config:concat.js.dest>',
				//dest: STAGING + '/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
				dest: STAGING + '/js/<%= pkg.name %>.js'
			}
		},
		
		/*----------------------------------( 6 )----------------------------------*/
		
		/**
		 * Task `img` optimizes JPGs and PNGs (with jpegtran & optipng).
		 *
		 * In order for this task to work properly, optipng must be installed and in the system PATH.
		 * If you can run "optipng" at the command line, then this task should work.
		 *
		 * @see jpegclub.org/jpegtran
		 * @see optipng.sourceforge.net
		 */
		
		img: {
			dist: STAGING + '/img/**'
		},
		
		/*----------------------------------( 7 )----------------------------------*/
		
		/**
		 * Task `rev` renames JS/CSS to prepend a hash of their contents for easier versioning.
		 *
		 * @bug "<WARN> Unable to read "intermediate/img/megakrill/" file (Error code: EISDIR). Use --force to continue. </WARN>".
		 */
		
		rev: {
			js: '<config:min.js.dest>',
			css: '<config:cssmin.css.dest>',
			img: '<config:img.dist>'
		},
		
		/*----------------------------------( 8 )----------------------------------*/
		
		/**
		 * Update references in html to revved files.
		 */
		
		usemin: {
			html: [
				STAGING + '/*.html'
			],
			css: [
				STAGING + '/css/*.css'
			]
		},
		
		/*----------------------------------( 9 )----------------------------------*/
		
		/**
		 * TBD - Generates appcache manifest file.
		 */
		
		//manifest: {},
		
		/*----------------------------------( 10 )----------------------------------*/
		
		/**
		 * Copies the whole staging(intermediate/) folder to output (publish/) one.
		 */
		
		//copy: {},
		
		/*----------------------------------( 11 )----------------------------------*/
		
		/**
		 * Print sucess status with elapsed time.
		 */
		
		//time: {},
		
		/*----------------------------------( 12 )----------------------------------*/
		
		//html: {},
		
		/*
		**--------------------------------------------------------------------------
		**
		** Grunt boilerplate:
		**
		**--------------------------------------------------------------------------
		*/
		
		lint : {
			files : [SRC + '/js/app/**/*.js']
		},
		
		//----------------------------------
		
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint qunit'
		},
		
		//----------------------------------
		
		qunit : {
			
			files: [
				SRC + '/*.html'
			]
			
		},
		
		//----------------------------------
		
		jshint : {
			// http://www.jshint.com/docs/
			options : {
				// Enforcing Options:
				curly         : true, // Requires you to always put curly braces around blocks in loops and conditionals.
				eqeqeq        : true, // This options prohibits the use of `==` and `!=` in favor of `===` and `!==`.
				immed         : true, // Prohibits the use of immediate function invocations without wrapping them in parentheses.
				latedef       : true, // Prohibits the use of a variable before it was defined.
				newcap        : true, // Requires you to capitalize names of constructor functions.
				noarg         : true, // Prohibits the use of `arguments.caller` and `arguments.callee`.
				nonew         : true, // Prohibits the use of constructor functions for side-effects.
				quotmark      : true, // Enforces the consistency of quotation marks used throughout your code.
				regexp        : true, // Prohibits the use of unsafe `.` in regular expressions.
				undef         : true, // Prohibits the use of explicitly undeclared variables.
				unused        : true, // Warns when you define and never use your variables.
				trailing      : true, // Makes it an error to leave a trailing whitespace in your code.
				// Relaxing Options:
				boss          : true, // This option suppresses warnings about the use of assignments in cases where comparisons are expected.
				sub           : true, // This option suppresses warnings about using `[]` notation when it can be expressed in dot notation: `person['name']` vs. `person.name`.
				eqnull        : true, // This option suppresses warnings about `== null` comparisons.
				// Environments:
				browser       : true, // This option defines globals exposed by modern browsers: all the way from good ol' `document` and `navigator` to the HTML5 `FileReader` and other new developments in the browser world.
				devel         : true  // This option defines globals that are usually used for logging poor-man's debugging: `console`, `alert`, etc.
			},
			// https://github.com/jshint/node-jshint
			globals : {
				// Only one extra option is unique to node-jshint: `globals` allows you to define an object of globals that get ignored for every file.
				jQuery  : true,
				//console : true
			}
		},
		
		//----------------------------------
		
		uglify: {}
		
	});
	
	/*----------------------------------( Register tasks: )----------------------------------*/
	
	grunt.registerTask('default', '');
	
	//----------------------------------
	
	grunt.registerTask('fresh', 'clean mkdirs');
	
	/*----------------------------------( Load scripts: )----------------------------------*/
	
	// Load the node-build-script and helpers:
	grunt.loadNpmTasks('node-build-script'); // https://github.com/h5bp/node-build-script/wiki/overview
	
	//----------------------------------
	
	// Load plugin for linting and minifying CSS:
	grunt.loadNpmTasks('grunt-css'); // https://github.com/jzaefferer/grunt-css
	
	//----------------------------------
	
	// LESS task for grunt:
	grunt.loadNpmTasks('grunt-less'); // https://github.com/jharding/grunt-less
	
	/*--------------------------------------------------------------------*/
	
	// That's all folks!
	
};
