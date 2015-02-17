module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      release: [
        "dist/**", "build/**"
      ]
    },
    copy: {
      fonts: {
        files: [{
          expand: true,
          cwd: 'bower_components/bootstrap/fonts',
          src: ['./*'],
          dest: 'dist/css/fonts'
        }]
      }
    },
    less: {
      compileBlox: {
        options: {
          strictImports: true,
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        files: { "build/css/<%= pkg.name %>.css": ['src/css/<%= pkg.name %>.less'] }
      }
    },
    concat: {
      options: {
        separator: "\n"
      },
      js: {
        src: [
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/TableDnD/js/jquery.tablednd.js',
          'bower_components/jquery-observe/jquery-observe.js',
          'bower_components/sortable/js/sortable.js',
          'bower_components/filter.js/dist/filter.js',
          'bower_components/mustache/mustache.js',
          'bower_components/numeral/numeral.js',
          'src/js/components.js',
          'src/js/finalize.js'
        ],
        dest: 'dist/js/<%= pkg.name %>-light.js'
      },
      jsfull: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'dist/js/<%= pkg.name %>-light.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        beautify: false
      },
      build: {
        files: {
            'dist/js/<%= pkg.name %>-min.js': ['dist/js/<%= pkg.name %>.js'],
            'dist/js/<%= pkg.name %>-light-min.js': ['dist/js/<%= pkg.name %>-light.js']
        }
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        sourceMap: true
      },
      combine: {
        files: {
          "dist/css/<%= pkg.name %>.min.css": ['dist/css/<%= pkg.name %>.css']
        }
      }
    },
    watch: {
      js: {
         files: ['src/**/*.js'],
         tasks: ['concat:js','concat:jsfull','uglify'],
         options: {
          livereload: true
         }
      },
      css: {
         files: ['src/**/*.css','src/**/*.less'],
         tasks: ['less','cssmin'],
         options: {
          livereload: true
         }
      },
      html: {
         files: ['src/**/*.html','src/**/*.htm'],
         tasks: ['copy:dist','copy:html'],
         options: {
          livereload: true
         }
      },
      test: {
         files: ['test/**/*.html','test/**/*.htm'],
         tasks: [],
         options: {
          livereload: true
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