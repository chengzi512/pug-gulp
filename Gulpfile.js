var gulp = require('gulp'),//基础库
    cleanCSS = require('gulp-clean-css'),//css压缩
    rename = require("gulp-rename"),//重命名
    uglify = require('gulp-uglify'),//js压缩
    babel = require("gulp-babel"),//转换ES6
    less = require('gulp-less'),//less预编译
    pug = require('gulp-pug'),//pug编译
    postcss = require('gulp-postcss'),//postcss编译
    autoprefixer = require('autoprefixer');//postcss处理前缀

const del = require('del'),
    rev = require('gulp-rev'),//添加时间戳hash5
    concat = require('gulp-concat'),//合并
    revCollector = require('gulp-rev-collector'),//给资源加上时间戳
    minifyHTML   = require('gulp-minify-html'),//压缩html
    gulpsync=require('gulp-sync')(gulp),//同步gulp任务
    replace = require('gulp-replace'),//替换
    useref = require('gulp-useref');

/*变量定义*/
const baseFile=outUrl='./wai';
const cssFiles=baseFile+'/**/*.css',
    jsFiles=[baseFile+'/**/*.js','!'+baseFile+'/**/*.min.js'],
    htmlFiles=[baseFile+'/**/*.html','!'+baseFile+'/**/*.pug','!'+baseFile+'/template/**/*.pug'],
    // remoteUrl='http://12.15.0.105:8002';
    // remoteUrl='http://12.15.0.112:8002';
    remoteUrl='./cdn';
/*开发*/
gulp.task('css', function () {
    return gulp.src(cssFiles)
        .pipe(less())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest(outUrl))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(outUrl))
});

gulp.task('js', function () {
    return gulp.src(jsFiles)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(outUrl))
});

gulp.task('pug', function () {
    return gulp.src(htmlFiles)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(outUrl))
});

gulp.task('default',()=>{
    gulp.watch(cssFiles,['css']);
    gulp.watch(jsFiles,['js']);
    gulp.watch(htmlFiles,['pug']);
});
/*发布*/
gulp.task('cls', ()=> {
    del(['./dist']);
});
gulp.task('rev:css', function () {
    return gulp.src(['./www/content/**/*.min.css','!./www/assets/**'])
        .pipe(rev())
        .pipe(gulp.dest('dist/cdn/css'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'dist/rev/css' ) );
});
//打包公共引用文件common.js,拷贝到dist目录下
gulp.task('rev:cc', function () {
    return gulp.src([
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/lodash/dist/lodash.min.js',
        './bower_components/amazeui/dist/js/amazeui.min.js'])
        .pipe(concat('_common.min.js'))
        .pipe(gulp.dest('www'));
});
gulp.task('rev:scripts', function () {
    return gulp.src(['./www/**/*.min.js','!./www/assets/**'])
        .pipe(rev())
        .pipe(gulp.dest('dist/cdn/js'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'dist/rev/js' ) );
});
// 拷贝静态资源
gulp.task('rev:resource', function () {
    return gulp.src(['./www/content/**','!./www/content/*.css','!./www/content/*.less'])
        .pipe( gulp.dest('./dist/cdn/css') );
});
// 打包字体资源
gulp.task('rev:fonts', function () {
    gulp.src(['./favicon.ico']).pipe(gulp.dest('./dist'));
    gulp.src(['./www/assets/videojs/*.js']).pipe(gulp.dest('./dist/cdn/js'));
    gulp.src(['./www/assets/videojs/*.css']).pipe(gulp.dest('./dist/cdn/css'));
    gulp.src(['./www/assets/*.css']).pipe(gulp.dest('./dist/cdn/css'));
    return gulp.src(['./www/fonts/**'])
        .pipe( gulp.dest('./dist/cdn/fonts') );
});
//压缩html，拷贝到dist目录下
gulp.task('rev:html', function () {
    return gulp.src(['./dist/rev/**/*.json',baseFile + '/**/*.html'])
        .pipe(useref({noAssets:true}))
        .pipe( revCollector({
            replaceReved: true
        }) )
        .pipe( minifyHTML({
            empty:true,
            spare:true
        }) )
        .pipe( gulp.dest('./dist') );
});
gulp.task('rev:replace', function () {
    return gulp.src(['./dist/**/*.css','./dist/**/*.html','./dist/**/*.js'])
        .pipe(replace('./content/',remoteUrl+'/static/common/css/'))
        .pipe(replace('(imgs/','('+remoteUrl+'/static/common/css/imgs/'))
        .pipe(replace('./css/',remoteUrl+'/static/common/css/'))
        .pipe(replace('./js/',remoteUrl+'/static/common/js/'))
        // .pipe(replace('../fonts/',remoteUrl+'/static/common/fonts/'))
        .pipe( gulp.dest('./dist'));
});
gulp.task('rev:replaceDetail', function () {
    return gulp.src(['./dist/detail.html'])
        .pipe(replace('./content/',remoteUrl+'/static/common/css/'))
        .pipe(replace('./css/',remoteUrl+'/static/common/css/'))
        .pipe(replace('./js/',remoteUrl+'/static/common/js/'))
        .pipe(replace('./','../../'))
        .pipe(replace('<#if></#if>','<#if type == 0 > 公司动态 <#elseif type == 1 > 产品新闻 <#else> 行业新闻 </#if>'))
        .pipe(rename('new.html'))
        .pipe( gulp.dest('./dist'));
});
gulp.task('clean',()=>{
    del(['./dist/rev','./www/_common.min.js','./dist/**/assets','./dist/**/v.min.js']);
});
gulp.task('revTask',gulpsync.sync([['css','js','pug'],'rev:cc',['rev:css','rev:scripts','rev:resource','rev:fonts'],'rev:html','rev:replace','rev:replaceDetail','clean']));