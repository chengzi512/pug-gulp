# pug-gulp 建站脚手架
## 版本
v1.0.1
## 使用

//安装开发包
```
npm install
```
//开发编译
```
gulp
```
//打包

//修改【变量定义】：remoteUrl
```
gulp revTask
```
## 文件结构
* dist 打包文件
* favicon.ico 图标
* Gulpfile.js gulp配置文件
* package.json npm配置文件

这个脚手架主要是用于一些小的系统，不想用任何框架来实现的，纯html+javascript+css来实现一个网页的呈现，用于官网的特别多
* html采用pug模板书写，更简单，同时也可以编译时模块化
* js可以用最新的ES6的语法，在gulp工作流上有做处理的，如果在引用时注意直接引用min文件即可
* css采用less预处理器，加上postcss的处理更加high

这个是自己整理后自己用的，如果你看到了或者正在使用有什么问题可以给我留言或者留言哈

个人站：www.z-im.com