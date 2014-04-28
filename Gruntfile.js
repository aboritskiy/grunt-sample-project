/* jslint node: true */
module.exports = function(grunt) {
    // configure the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: [
                'build/',
                './<%= pkg.name %>.v.<%= pkg.version %>.zip'
            ],
            afterBuild: [
                '.tmp/'
            ]
        },
        copy: {
            build: {
                files: [
                    {expand: true, src: ['fonts/*'], dest: 'build/', filter: 'isFile'},
                    {expand: true, src: ['images/**'], dest: 'build/'},
                    {src: ['package.json'], dest: 'build/'},
                    {src: ['*.html'], dest: 'build/'},
                    {src: ['ReadMe.md'], dest: 'build/'},
                    {src: ['ChangeLog.md'], dest: 'build/'},
                    {src: ['js/html5shiv.js', 'js/respond.min.js'], dest: 'build/'}
                ]
            }
        },
        'useminPrepare': {
            html: [
                'index.html'
            ],
            options: {
                dest: 'build/',
                staging: '.tmp/',
                root: '.'
            }
        },
        usemin: {
            options: {
                dirs: ['build/']
            },
            html: ['build/*.html']
        },
        uglify: {
            generated: {
                options: {
                    preserveComments: 'some'
                }
            }
        },
        compass: {
            /* remove cache before building */
            clean: {
                options: {
                    config: 'config.rb',
                    clean: true
                }
            },
            /* build SASS */
            build: {
                options: {
                    config: 'config.rb',
                    outputStyle: 'compact',
                    debugInfo: false,
                    noLineComments: true
                }
            }
        },
        compress: {
            build: {
                options: {
                    archive: 'build/<%= pkg.name %>.v.<%= pkg.version %>.min.zip'
                },
                files: [
                    {expand: true, src: ['**/*', '!<%= pkg.name %>.v.*.zip'], cwd: 'build/'} // includes all files from the build path except the archive itself
                ]
            }
        },
        jshint: {
            src: [
                /* 3rd party scripts are not included here */
                'Gruntfile.js',
                'js/jquery.mediaQueryBreakDetector.js',
                'js/jquery.extractCoordinateFromMouseEvent.js',
                'js/jquery.equalizeHeights.js',
                'js/jquery.gentlyScrollTo.js'
            ],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                undef: true,
                browser: true,
                jquery: true,
                '-W099': true, /* switching off "W099: Mixed spaces and tabs." */
                globals: {
                    /* specify missing globals here, if any */
                    brightcove: true
                }
            }
        }
    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-w3c-validation');
    grunt.loadNpmTasks('grunt-run-grunt');

    // define the tasks
    grunt.registerTask(
        'build',
        'Scans html files for scripts and css blocks to adjust the config and build the files.',
        [
            'useminPrepare',
            'concat',
            'uglify',
            'cssmin',
            'usemin',
            'clean:afterBuild'
        ]
    );
    grunt.registerTask(
        'default',
        'Compiles the Project',
        [
            'jshint',
            'clean',
            'compass',
            'copy',
            'build',
            'compress'
        ]
    );
};