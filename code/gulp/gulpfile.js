// 实现这个项目的构建任务

const { src, dest, parallel, series, watch } = require('gulp')
const loadPlugin = require('gulp-load-plugins')
const del = require('del')
const browserSync = require('browser-sync')

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
const plugins = loadPlugin()
const bs = browserSync.create()

const clean = () => {
  return del(['dist', 'temp'])
}

const page = () => {
  return src('**/*.html', { base: 'src', cwd: 'src' })
    .pipe(plugins.swig({ data }))
    .pipe(dest('temp'))
}

const style = () => {
  return src('styles/*.scss', { base: 'src', cwd: 'src/assets' })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest('temp'))
}

const script = () => {
  return src('scripts/*.js', { base: 'src', cwd: 'src/assets' })
    .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
    .pipe(dest('temp'))
}

const image = () => {
  return src('images/**', { base: 'src', cwd: 'src/assets' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('fonts/**', { base: 'src', cwd: 'src/assets' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('**', { base: 'public', cwd: 'public' })
    .pipe(dest('dist'))
}

const serve = () => {
  watch('styles/*.scss', { cwd: 'src/assets' }, style)
  watch('scripts/*.js', { cwd: 'src/assets' }, script)
  watch('*.html', { cwd: 'src' }, page)
  watch([
    'images/**',
    'fonts/**',
  ], { cwd: 'src/assets' }, bs.reload)
  watch(['**'], { cwd: 'public' }, bs.reload)

  bs.init({
    notify: false,
    port: 2080,
    open: false,
    files: 'temp/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  return src('*.html', { base: 'temp', cwd: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.']}))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest('dist'))
}

const compile = parallel(page, style, script)

const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra
  )
)

const start = series(build, serve)

// TODO add more command like deploy in online env
const deploy = build

module.exports = {
  clean,
  serve,
  build,
  start,
  deploy
}
