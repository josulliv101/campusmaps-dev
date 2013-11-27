'use strict';

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['bower_components/requirejs/require.js', '<%= concat.dist.dest %>'],
        dest: 'dist/campusmaps.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/campusmaps.min.js'
      }
    },
    jasmine: {
      test: {
        src: ['app/**/*.js', '!app/config.js'],
        options: {
          specs: 'test/*Spec.js',
          helpers: 'test/*Helper.js',
          keepRunner: true,
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: 'app/config.js',
            requireConfig: {
              baseUrl: 'app/'
            }
          }
        }
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      }
    },
    jshint: {
/*    gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },*/
      app: {
        options: {
          jshintrc: 'app/.jshintrc'
        },
        src: ['app/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
/*    gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },*/
      src: {
        files: ['app/**/*.js'],
        tasks: ['jshint:src', 'jasmine']
      },
      test: {
        files: ['test/**/*.js'],
        tasks: ['jshint:test', 'jasmine']
      },
    },
    requirejs: {
      compile: {
        options: {
          name: 'config',
          mainConfigFile: 'app/config.js',
          out: '<%= concat.dist.dest %>',
          optimize: 'none'
        }
      }
    },
    connect: {
      development: {
        options: {
          keepalive: true
        }
      },
      production: {
        options: {
          keepalive: true,
          port: 8000,
          middleware: function (connect, options) {
            return [
              // rewrite requirejs to the compiled version
              function (req, res, next) {
                if (req.url === '/bower_components/requirejs/require.js') {
                  req.url = '/dist/campusmaps.min.js';
                }
                next();
              },
              connect.static(options.base),

              ];
            }
          }
        }
      }
    });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-karma');

  // Default task.
  grunt.registerTask('default', ['jshint', 'jasmine', 'clean', 'requirejs', 'concat', 'uglify']);
  grunt.registerTask('server', ['connect:development']);
  grunt.registerTask('server:prod', ['default', 'connect:production']);
  grunt.registerTask('test', ['jasmine']);
};