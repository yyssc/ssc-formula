# ssc-formula

![](screenshot_20170413_005.jpg)

## 如何发布

1. 编译`npm run build`
2. 修改`package.json`中的版本号
3. 提交`git add package.json && git commit -m 'Release v0.1.0'`
4. 打tag： `git tag -a v0.1.0 -m 'v0.1.0'`
5. push到remote： `git push --follow-tags`
6. 发布： `npm publish`
