# Jbsd使用教程

> [!NOTE]
> 本插件需要电脑中带有Python3环境
> 
> Python3环境的安装请自行搜索
>
> 推荐使用Python虚拟环境

## 环境搭建

使用资源管理器进入**BaldrSky.exe**文件所在的目录

鼠标右键选择**在终端中打开**

接着输入下列命令（请忽略'>'这个符号）

```
> pip install frida-tools==13.0.0
> frida --version
```

无报错且显示frida版本为16.7.19 则环境准备完毕

## 本插件使用方法

在Github本仓库主页面下

点击**绿色按钮Code** 选择**Download ZIP**下载压缩包

解压压缩包后把**hook.js**文件复制到**BaldrSky.exe**文件所在的目录下

1. 鼠标双击启动BaldrSky.exe

2. 鼠标右键选择**在终端中打开** 接着输入下列命令

```
> frida BaldrSky.exe -l hook.js
```

若启动成功 则应显示如下图所示（显示到`[Local::BaldrSky.exe ]->`这一行）

![powershell](./img/powershell.png)