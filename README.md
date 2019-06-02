## Vue多页面配置 子项目单独打包

### 简介

modules中的每个子项目可以独立打包,public文件夹独立  
>在index项目运行时,跳转到其他子项目时,其他子项目的public路径无法使用
- index项目为读取全部项目config.json配置的导航展示项目 
- tools/build.js 打包工具
- tools/utils.js 通用的工具类选项和基本参数封装
- vue.config.js  配置了多页面选项和独立copy静态public文件夹
    
### 命令

npm install 安装依赖

npm run serve 运行项目 可选参数  --子项目模块名称(例:--test1)直接进入子项目启动,无参数默认启动index项目;  

除index项目为运行全部子项目 其他子项目运行只启动子项目本身;

npm run build 打包项目 参数必须  --子项目模块名称(例:--test2)打包对应的子项目, 输入--@all打包全部项目;

### config.json文件配置
> 只有配置了config.json的项目才可以被index读取
- moduleName: 项目名称 
- author: 作者- 
- logo: 项目logo(显示为圆形)
- title: 简介的标题- 
- text: 简介的内容
- style: 样式: 
   - backgroundImage: 背景图片(网络图片)
   - backgroundColor: 背景颜色(默认值为#8b8b8b)
   - color:文字颜色(默认#fff);
