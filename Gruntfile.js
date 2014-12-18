module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      release: [
        "dist/**"
      ]
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
        dest: 'dist/js/bloxui.js'
      },
      css: {
        src: [
          'build/css/glyphicons.css',
          'src/css/**.css',
        ],
        dest: 'dist/css/bloxui.css'
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
    less: {
      icons: {
        files: {
          "build/css/glyphicons.css": "src/css/bloxui.less"
        }
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      combine: {
        files: {
          "dist/css/bloxui-min.css": ["dist/css/bloxui.css"]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/dist',
          src: ['./*'],
          dest: 'www'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: 'bower_components/bootstrap/fonts',
          src: ['./*'],
          dest: 'dist/fonts'
        }]
      },
      html: {
        files: [{
          expand: true,
          cwd: 'src/html',
          src: ['*.html','*.htm'],
          dest: 'dist/html'
        }]
      },
      test: {
        files:[{
          expand: true,
          cwd: './',
          src: ['test/**'],
          dest: 'dist'
        }]
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