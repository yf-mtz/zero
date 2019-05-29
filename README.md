## Vue多页面配置 子项目单独打包

### 简介

每个module可以独立打包,有独立的public文件夹,index项目为读取全部项目config.json配置的导航展示项目,tools/build.js为拦截打包命令的工具,vue.config.js里进行了serve命令的参数拦截
    
### 命令

npm install 安装依赖

npm run serve 运行项目 可选参数  --子项目模块名称(例:--test1)直接进入子项目启动,无参数默认启动index项目

npm run build 打包项目 参数必须  --子项目模块名称(例:--test2)打包对应的子项目, 输入--@all打包全部项目

### config.json文件配置

- moduleName: 项目名称 
- author: 作者- 
- logo: 项目logo(显示为圆形)
- title: 简介的标题- 
- text: 简介的内容
- style: 样式: 
   - backgroundImage: 背景图片(网络图片)
   - backgroundColor: 背景颜色(默认值为#8b8b8b)
   - color:文字颜色(默认#fff);
