module.exports = function (grunt) {

    // measures the time each task takes
    require('time-grunt')(grunt);

    // load grunt config
    //require('load-grunt-config')(grunt);
    require('load-grunt-tasks')(grunt);

  // Default task (check errors, exec build, karma)
  grunt.registerTask('default', ['jshint','build']); //,'karma:unit'
  grunt.registerTask('cleanAll', ['clean']);
  grunt.registerTask('build', ['clean','html2js','concat','less:development','copy:assets']); //'recess:build'
  grunt.registerTask('release', ['clean','html2js','uglify','jshint', 'concat:dist', 'concat:index','less:production','copy:assets']);//,'karma:unit','recess:min'
  //grunt.registerTask('test-watch', ['karma:watch']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    tmpdir: 'tmp',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      js: ['src/**/*.js'],
      jsTpl: ['<%= tmpdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      },
      less: ['src/less/stylesheet.less'], // recess:build doesn't accept ** in its file patterns
      lessWatch: ['src/less/**/*.less']
    },
    clean: ['<%= distdir %>/*', '<%= tmpdir %>/*'],
    copy: {
      assets: {
        files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
      }
    },
    karma: {
      unit: { options: karmaConfig('test/config/unit.js') },
      watch: { options: karmaConfig('test/config/unit.js', { singleRun:false, autoWatch: true}) }
    },
    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= tmpdir %>/templates/app.js',
        module: 'templates.app'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= src.tpl.common %>'],
        dest: '<%= tmpdir %>/templates/common.js',
        module: 'templates.common'
      }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>', '<%= src.jsTpl %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      angular: {
        src:['vendor/angular/angular.js', 
            //'vendor/angular-route/angular-route.js', 
            'vendor/angular-ui-router/release/angular-ui-router.js', 
            //'vendor/angular-resource/angular-resource.js',
            //'vendor/angular-sanitize/angular-sanitize.js',
            //'vendor/angular-cookies/angular-cookies.js',
            //'vendor/angular-touch/angular-touch.js',
            //'vendor/angular-carousel/dist/angular-carousel.js',
            //'vendor/underscore/underscore.js',
            //'vendor/angular-google-maps/dist/angular-google-maps.js'
            'vendor/angular-bootstrap/ui-bootstrap.js',
            'vendor/angular-bootstrap/ui-bootstrap-tpls.js'
            ],
        dest: '<%= distdir %>/angular.js'
      },
      //mongo: {
      //  src:['vendor/mongolab/*.js'],
      //  dest: '<%= distdir %>/mongolab.js'
      //},
      bootstrap: {
        src:['vendor/bootstrap/dist/js/bootstrap.js'],
        dest: '<%= distdir %>/bootstrap.js'
      },
      jquery: {
        src:['vendor/jquery/dist/jquery.js'],
        dest: '<%= distdir %>/jquery.js'
      }
    },
    uglify: {
      //dist:{
      //  options: {
      //    banner: "<%= banner %>"
      //  },
      //  src:['<%= src.js %>' ,'<%= src.jsTpl %>'],
      //  dest:'<%= distdir %>/<%= pkg.name %>.js'
      //},
      angular: {
        src:['<%= concat.angular.src %>'],
        dest: '<%= distdir %>/angular.js'
      },
      bootstrap: {
        src:['<%= concat.bootstrap.src %>'],
        dest: '<%= distdir %>/bootstrap.js'
      },
      jquery: {
        src:['<%= concat.jquery.src %>'],
        dest: '<%= distdir %>/jquery.js'
      }
    },
    less: {
        development: {
            //options: {
            //  paths: ["assets/css"]
            //},
            files: {
              '<%= distdir %>/css/<%= pkg.name %>.css': '<%= src.less %>'
            }
        },
        production: {
            options: {
            //  paths: ["assets/css"],
              cleancss: true
            },
            files: {
              '<%= distdir %>/css/<%= pkg.name %>.css': '<%= src.less %>'
            }
        }
    },
    //recess: { // NOTE: less di bootstrap va compilato con grunt-less, altrimenti c'è un errore di parsing
    //  build: {
    //    files: {
    //      '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
    //    },
    //    options: {
    //      compile: true
    //    }
    //  },
    //  min: {
    //    files: {
    //      '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
    //    },
    //    options: {
    //      compress: true
    //    }
    //  }
    //},
    //watch:{
    //  all: {
    //    files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
    //    tasks:['default','timestamp']
    //  },
    //  build: {
    //    files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
    //    tasks:['build','timestamp']
    //  }
    //},
    jshint:{ // Check syntax error in js
      files:['gruntFile.js', '<%= src.js %>', '<%= src.jsTpl %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options:{
        curly:true,
        debug: true, // <--- set to false in production
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });

};
