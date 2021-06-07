# 请求调页存储管理方式模拟项目文档

## 一、项目概述

​	本项目为操作系统课程中内存管理模块的请求调页存储管理方式模拟。

​	假设每个页面可存放10条指令，分配给一个作业的内存块数为4块。模拟一个作业的执行过程，该作业有320条指令，即它的地址空间为32页，目前所有页还没有调入内存。在模拟过程中，如果所访问指令在内存中，则显示其物理地址，并转到下一条指令；如果没有在内存中，则发生缺页，此时需要记录缺页次数，并将其调入内存。如果4个内存块中已装入作业，则需进行页面置换。所有320条指令执行完成后，计算并显示作业执行过程中发生的缺页率。

​	为了有更清晰的可视化界面和更好的交互体验，选择采用以网页的方式呈现项目内容。项目支持通过点击按钮与选择框进行与系统的交互，并通过页面中组件的变化来展示页面分配的情况。

## 二、项目开发背景

​	开发环境：node.js + Chrome + vscode

​	开发框架：vue 2.6.11

​	开发语言：html + css + javascript

## 三、项目需求分析

​	请求调页存储管理方式模拟基本功能

- 内存中包含四个内存块
- 每个页面包含10条指令，共实现320条指令执行
- 可选择替换算法与指令执行方式
- 计算缺页次数与缺页率

## 四、项目功能分析

​	替换算法

1. FIFO

   > FIFO(First in Fist out)算法思想为：当需要淘汰一个页面时，总是选择驻留主存时间最长的页面进行淘汰，即先进入主存的页面先淘汰。其理由是：最早调入主存的页面不再被使用的可能性最大。 

   ​	本项目中通过维护FIFO数组进行算法的实现，在每次执行相应指令之后，对FIFO数组进行更新，在每次需要进行FIFO换页操作时，可以选择FIFO数组第一个元素为调出页面内存块，相应代码如下：

   ```js
   FIFO:function(page){
       let seq=this.sequence[0].value;
       let flag=0;
       for(let i=0;i<seq.length;i++){
           if(seq[i]==page){
               flag=1;
               break;
           }
       }
       if(flag==0){
           if(seq.length<4){
               seq.push(page);
           }
           else{                   
               seq.splice(0,1);
               seq.push(page);
           }
       }
       this.sequence[0].value=seq;
   }
   ```

2. LRU

   > 最近最久未使用（LRU）算法基本思想是：利用局部性原理，根据一个作业在执行过程中过去的页面访问历史来推测未来的行为。它认为过去一段时间里不曾被访问过的页面，在最近的将来可能也不会再被访问。所以，这种算法的实质是：当需要淘汰一个页面时，总是选择在最近一段时间内最久不用的页面予以淘汰。 

   ​	同样，本项目通过维护LRU数组进行算法实现，在每次执行相应指令后，对LRU数组进行更新，在每次通过LRU算法进行换页操作时，可以选择LRU数组第一个元素为调出页面内存块，相应代码如下：

   ```javascript
   LRU:function(page){
       let seq=this.sequence[1].value;
       let flag=0;
       for(let i=0;i<seq.length;i++){
           if(seq[i]==page){
               flag=1;
               seq.splice(i,1);
               seq.push(page);
               break;
           }
       }
       if(flag==0){
           if(seq.length<4){
               seq.push(page);
           }
           else{
               seq.splice(0,1);
               seq.push(page);
           }
       }
       this.sequence[1].value=seq;
   },
   ```

​	指令执行方式

​		本项目提供三种指令模拟执行方式，其中**顺序执行**是通过编号对0\~319号指令每个都执行一次，其中没有重复执行情况。**随机执行**方式是通过对0~\319号指令随机执行，并且没有重复执行情况。最后**混合执行**是由50%顺序执行指令，25%均匀分布在前地址部分执行指令，25％均匀分布在后地址部分执行指令组成，为防止出现特殊情况发生，允许一条指令重复执行。

​	项目关键函数

| 函数名称                                   | 返回值类型 | 说明                                   |
| ------------------------------------------ | ---------- | -------------------------------------- |
| executeInstruction:function()              | void       | 点击单次执行后，进行页调换与指令执行   |
| missingThePage:function(curPage,page)      | [ , ]      | 判断当前执行指令是否缺页               |
| replacePage:function(curPage,page)         | [ , ]      | 对外存中的页面进行加载                 |
| replacement:function(curPage,seq)          | [ , ]      | 在内存块都加载页面的情况下，进行页替换 |
| updateCondition:function(miss,instruction) | void       | 进行缺页率等数据更新与指令替换         |

## 五、项目演示

​	进入界面：

![](https://i0.hdslb.com/bfs/album/1c45f8a5b3324afb6ae672d9cf409935b9f09ca8.png)

​	选择框界面：

![](https://i0.hdslb.com/bfs/album/2de04c20cdcd0b5e5eccbe53a37acd98f71cf542.png)

​	单次执行界面：

![](https://i0.hdslb.com/bfs/album/9554d59fedd3a3e1ffe4e449251d40b0f46f1fad.png)

​	多次执行界面：

![](https://i0.hdslb.com/bfs/album/03fb57fff7128cbb93035b190b901baab06f561a.png)

​	执行完成界面：

![](https://i0.hdslb.com/bfs/album/09fceb11b9de92ea1f243259a90f907aaefe9ea8.png)

## 六、项目总结

​	相对于第一次进程管理项目，为求界面的客观性，采用网页开发代替应用程序开发形式进行内存项目开发。

​	开发过程中的问题集中于对框架语法的不熟悉，因此项目逻辑可以进一步精简，相应前端UI界面也可更进一步优化。

## 七、项目重构

### Project setup
```shell
npm install
```

#### Compiles and hot-reloads for development
```shell
npm run serve
```

#### Compiles and minifies for production
```shell
npm run build
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

