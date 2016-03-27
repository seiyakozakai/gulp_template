### INSTALL
#### 0. Install Node.js and Download zip:

Click install
http://nodejs.org/

After that

```sh
$ node -v
$ cd gulp-template
$ npm init
```

#### 1. Install gulp globally:

```sh
$ npm install --global gulp
```

#### 2. Install gulp in your project devDependencies:

```sh
$ npm install --save-dev gulp
```

#### 3. Add Plugin

```sh
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
```

#### 4. Run gulp

```sh
$ gulp
```
