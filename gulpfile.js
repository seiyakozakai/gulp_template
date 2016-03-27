//MiniMatchパターン
//“sass/style.scss”
//→sass/style.scssだけヒット

//“sass/*.scss”
//→sassディレクトリ直下にあるscssがヒット

//“sass/**/*.scss”
//→sassディレクトリ以下にあるすべてのscssがヒット

//[“sass/**/.scss”,”!sass/sample/**/*.scss]
//→sass/sample以下にあるscssを除くsassディレクトリ以下のscssがヒット

var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var frontnote = require("gulp-frontnote");
var uglify = require("gulp-uglify");
var browser = require("browser-sync");
var concat = require("gulp-concat");
var rename = require('gulp-rename');
var less = require('gulp-less');
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var gulpFilter = require('gulp-filter');
var bower = require('main-bower-files');
var cssmin = require('gulp-cssmin');

gulp.task("server", function() {
    browser({
        server: {
            baseDir: "./"
        }
    });
});

//js圧縮
gulp.task("js", function() {
    gulp.src(["js/**/*.js","!js/min/**/*.js"])//処理するファイルを指定(jsファイル直下にあるすべてのjs)
        // 実行する処理をpipeでつないでいく
        .pipe(uglify())//圧縮
        .pipe( rename({
          extname: '.min.js'
        }) )
        .pipe(gulp.dest("./js/min"))//処理されたファイルが書き込まれる先を指定する
        .pipe(browser.reload({stream:true}))
});
//sassコンパイル
gulp.task("sass", function() {
    gulp.src("sass/**/*scss")//処理するファイルを指定(sassファイル直下にあるすべてのscss)
        .pipe(sass().on('error',sass.logError))// エラーでも止めない
        .pipe(autoprefixer())
        .pipe(gulp.dest("./css"))
        .pipe(browser.reload({stream:true}));
});

gulp.task("html", function() {
    gulp.src("./*.html")
        .pipe(browser.reload({stream:true}))
});

// css圧縮
gulp.task('cssmin', ["sass"], function () {
  gulp.src(["css/**/*.css","!css/min/**/*.css"])
  .pipe(cssmin())
  .pipe( rename({
    extname: '.min.css'
  }) )
  .pipe(gulp.dest("./css/min"))
  .pipe(browser.reload({stream:true}));
});

//gulp.watch([‘監視するファイルのパターン’],[‘実行したいタスク1’]);
gulp.task("default",['server'], function() {
    gulp.watch(["js/**/*.js","!js/min/**/*.js"],["js"]);//js(js/minファイル以外)にあるすべてのjs
    gulp.watch("sass/**/*.scss",["sass"]);//sassファイル直下にあるすべてのscss
    gulp.watch("./*.html",["html"]);
});

//-------------------------------------------------------------
//gulp bower.init　で起動
// bowerで導入したパッケージのCSSを取ってくるタスク
gulp.task('bowerCSS', function() {
  var cssLibDir = './assets/css', // cssを出力するディレクトリ
      cssFilter  = gulpFilter('**/*.css', {restore: true}),
      lessFilter = gulpFilter('**/*.less', {restore: true}); // Bootstrapのコアがlessなのでlessをファイルを抽出するフィルター
  return gulp.src( bower({
                paths: {
                  bowerJson: 'bower.json'
                      }
                  }))
              // SCSSファイルを抽出
              .pipe( cssFilter )
              .pipe( rename({
                prefix: '_',
                extname: '.css'
                }) )
              .pipe( gulp.dest(cssLibDir) )//処理されたファイルが書き込まれる先を指定する
              .pipe( cssFilter.restore )
              // LESSファイルを抽出
              .pipe( lessFilter )
              // LESSをコンパイル
              .pipe( less() )
              .pipe( rename({
                prefix: '_',
                extname: '.css'
                }) )
    // filter.restoreする前にgulp.destで出力しないとフィルター外のファイルも出力されてしまう
              .pipe( gulp.dest(cssLibDir) )//処理されたファイルが書き込まれる先を指定する
              .pipe( lessFilter.restore );
});

// パッケージのCSSを1つに結合してmin化するタスク
gulp.task('CSS.concat', ['bowerCSS'] ,function() {
  var cssDir = './assets/css/concat', // 結合したcssを出力するディレクトリ
      cssminDir = './css/min',
      cssLibDir = './assets/css/'; // ライブラリのCSSが置いてあるディレクトリ
  return gulp.src(cssLibDir + '_*.css')//処理するファイルを指定
    .pipe( concat('_bundle.css') )
    // CSSを1つにしたものを出力
    .pipe( gulp.dest(cssDir) )//処理されたファイルが書き込まれる先を指定する
    .pipe( minifyCss() )
    .pipe( rename({
      extname: '.min.css'
    }) )
    // CSSを1つにしてmin化したものを出力
    .pipe( gulp.dest(cssminDir) );//処理されたファイルが書き込まれる先を指定する
});

// bowerで導入したパッケージのjsを取ってきて1つにまとめるタスク
gulp.task('JS.concat', function() {
  var jsDir = './assets/js/concat', // jsを出力するディレクトリ
      jsminDir = './js/min',
      jsFilter = gulpFilter('**/*.js', {restore: true}); // jsファイルを抽出するフィルター
  return gulp.src( bower({
      paths: {
        bowerJson: 'bower.json'
      }
    }) )
    .pipe( jsFilter )
    .pipe( concat('_bundle.js') )
    // jsを1つにしたものを出力
    .pipe( gulp.dest(jsDir) )
    .pipe( uglify({
      // !から始まるコメントを残す
      preserveComments: 'some'
    }))
    .pipe( rename({
      extname: '.min.js'
    }) )
    // jsを1つにしてmin化したものを出力
    .pipe( gulp.dest(jsminDir))
    .pipe( jsFilter.restore );
});

// bowerのCSSとJSを取ってくるタスク
gulp.task('bower.init', ['bowerCSS', 'CSS.concat','JS.concat']);
