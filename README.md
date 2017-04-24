# ssc-formula

![](screenshot_20170413_005.jpg)

## 本地开发调试

```
npm run dev
```

浏览器会自动打开demo

因为该组件需要从后端获取数据（比如参照数据），所以推荐使用[ssc-dev-server](https://github.com/yyssc/ssc-dev-server)
以便协助开发。

## 如何发布

1. 修改`CHANGELOG.md`
2. 修改`package.json`中的版本号
3. 定义版本号
```
RELEASE_VERSION=v0.1.0
```
4. 运行如下命令
```
npm run build # 编译代码
git add . && git commit -m "Release $RELEASE_VERSION" # 提交
git tag -a $RELEASE_VERSION -m "$RELEASE_VERSION" # 打tag
git push --follow-tags # push到remote
npm publish # 发布
```

## TODO

- [x] Demo
- [ ] 单元测试
- [ ] 发布脚本
