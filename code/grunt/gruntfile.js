const loadGruntTasks = require('load-grunt-tasks')
const sass = require('sass')

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

module.exports = grunt => {
  grunt.initConfig({
    swig: {
      options: {
        data,
        cache: false,
      },
      main: {
        files: {
          'dist/index.html': 'src/index.html',
          'dist/about.html': 'src/about.html',
        }
      }
    },
    sass: {
      options: {
        sourceMap: true,
        implementation: sass
      },
      main: {
        files: {
          'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      main: {
        files: {
          'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
        }
      }
    },
    watch: {
      js: {
        files: ['src/assets/scripts/*.js'],
        tasks: ['babel']
      },
      css: {
        files: ['src/assets/styles/*.scss'],
        tasks: ['css']
      },
      html: {
        files: ['src/**.html'],
        tasks: ['swig']
      }
    }
  })

  loadGruntTasks(grunt)

  grunt.registerTask('default', ['sass', 'babel', 'watch'])
}