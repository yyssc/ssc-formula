# ssc-formula

## 如何发布

1. 修改`package.json`中的版本号
2. 提交`git add package.json && git commit -m 'Release v0.1.0'``
3. 打tag： `git tag -a v0.1.0 -m 'v0.1.0'`
4. push到remote： `git push --follow-tags`
5. 发布： `npm publish`
