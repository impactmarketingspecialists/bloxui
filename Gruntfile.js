module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      release: [
        "dist/**"
      ]
    },
    copy: {
      boostrap: {
        files: [{
          expand: true,
          cwd: 'bower_components/bootstrap/less',
          src: ['./**'],
          dest: 'build/bootstrap/less'
        }]
      },
      boostrapOverrides: {
        files: [{
          expand: true,
          cwd: 'src/css/bootstrap',
          src: ['./**'],
          dest: 'build/bootstrap/less'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: 'bower_components/bootstrap/fonts',
          src: ['./*'],
          dest: 'dist/fonts'
        }]
      }
    },
    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'build/bootstrap/less/bootstrap.less',
        dest: 'build/css/<%= pkg.name %>-bootsrap.css'
      },
      compileTheme: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>-theme.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>-theme.css.map'
        },
        src: 'build/bootstrap/less/theme.less',
        dest: 'build/css/<%= pkg.name %>-bootstrap-theme.css'
      },
      compileBlox: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>-theme.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>-theme.css.map'
        },
        src: 'src/css/bloxui.less',
        dest: 'build/css/<%= pkg.name %>-core.css'
      }
    },
    concat: {
      options: {
        separator: "\n"
      },
      js: {
        src: [
          'bower_components/TableDnD/js/jquery.tablednd.js',
          'bower_components/sortable/js/sortable.js',
          'src/js/*.js'
        ],
        dest: 'dist/js/bloxui-light.js'
      },
      jsfull: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'dist/js/bloxui-light.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      css: {
        src: [
          'build/css/*.css'
        ],
        dest: 'dist/css/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        beautify: false
      },
      build: {
        files: {
            'dist/js/bloxui-min.js': ['dist/js/bloxui.js'],
            'dist/js/bloxui-light-min.js': ['dist/js/bloxui-light.js']
        }
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      combine: {
        files: {
          "dist/css/<%= pkg.name %>-min.css": ["dist/css/<%= pkg.name %>.css"]
        }
      }
    },
    watch: {
      js: {
         files: ['src/**/*.js'],
         tasks: ['concat:js','concat:jsfull','uglify'],
         options: {
          livereload: false
         }
      },
      css: {
         files: ['src/**/*.css','src/**/*.less'],
         tasks: ['concat:css','less','cssmin'],
         options: {
          livereload: false
         }
      },
      html: {
         files: ['src/**/*.html','src/**/*.htm'],
         tasks: ['copy:dist','copy:html'],
         options: {
          livereload: false
         }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['copy', 'less', 'concat', 'uglify', 'cssmin']);
  grunt.registerTask('release', ['clean','copy', 'less', 'concat', 'uglify', 'cssmin']);

};