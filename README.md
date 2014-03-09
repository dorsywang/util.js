#util.js
###For a better,fast and effective development life, we have tried it!
======

##目标
util.js旨在聚集前端已有的大量优秀方法，打造单一方法库与目录，并且提供方法的打包与构建解决方案，使项目中基础库可大可小，适应于项目场景，达到100%的代码利用率。

##简介
>轻量基础库、方法库

>用时可直接拷贝

>拆卸式使用

>适用于mobile端简单页面

>适用于PC简单页面

>基于node、php等多种构建方法

##与jQ、JX等类库区别

###大小
util.js 代码量远远小于 jQ等类库
###代码利用率
util.js 代码利用率为100%  jQ等小于100%
###使用方式
util.js 拆卸式使用方式，用到该方法时增加该方法
jQ等不可拆卸，为一次引入
###目标达成
util.js 致力于单函数仓库(无太多依赖的单函数库、无对象、无方法、属性、即拷即用）
jQ等  致力于基础库，内部方法相互依赖，为统一整体


##为什么选择使用util.js?
面向移动端&PC轻量基础库，移动端或者PC一些页面简单只需要几个方法，没有必要引入很大的基础库，本项目是代码沉淀库，用时可以直接拷贝组成util文件，不会浪费过多代码与流量<br />

##util.js是否为重复轮子？
util.js旨在聚合与重组、构建方法目录，其代码将会来自优秀的开源基础库已有的方法代码，如jQuery、JX、JM等，util.js是将会优秀库的重组解决方案，代码不会重复编写。

##如何使用
###直接拷贝
>点击下方的代码目录链接，找到自己想要的函数，手动拷贝到自己的文件中

###基于构建工具增加方法 

@以完成基本架构
>从npm获取util.js
```shell
    npm install util.js
>初始化文件
```shell
    util init
```
>增加单个方法
```shell
    util add function
```

如增加css方法

```shell
    util add css
```

@以下为todo
>增加某个分类
```shell
        util add className
```

##代码方法目录

###[代码目录](./index/all.md)

欢迎贡献代码

##Other Project May Interest You
###[AlloyDesigner](http://alloyteam.github.io/AlloyDesigner/)
###[AlloyImage](http://alloyteam.github.io/AlloyImage/)
