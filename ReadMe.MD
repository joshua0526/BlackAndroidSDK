# 钱包资源导入方法
## 修改文件html
### 修改目标，给android提供交互方法，除非增加新的方法，一般不用修改。
## 修改panel.css文件
### 因为手机宽度问题，需要把375宽度修改为367。
## 修改PayView.ts文件
### 注释掉this.ObjAppend(headerTitle, aReturnGame)
## 重新编译ok