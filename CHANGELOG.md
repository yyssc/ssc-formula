## [v0.4.3]
> 2017-06-01

- **Bugfix:** 参照为entity获取的数据没有name等字段 ([#9])

[v0.4.3]: https://github.com/yyssc/ssc-formula/compare/v0.4.2...v0.4.3
[#9]: https://github.com/yyssc/ssc-grid/issues/9

## [v0.4.2]
> 2017-06-01

由于v0.4.1发布出错了，这里增加一次发布，请不要使用v0.4.2

[v0.4.2]: https://github.com/yyssc/ssc-formula/compare/v0.4.1...v0.4.2

## [v0.4.1]
> 2017-06-01

- **Bugfix:** 通过将[ssc-refer](https://github.com/tigerandgirl/ssc-refer)替换为[ssc-refer2](https://github.com/yyssc/ssc-refer2)解决react警告信息 ([#7])

[v0.4.1]: https://github.com/yyssc/ssc-formula/compare/v0.4.0...v0.4.1
[#7]: https://github.com/yyssc/ssc-grid/issues/7

## [v0.4.0]
> 2017-06-01

- **Feature:** 特殊处理refCode为entity的参照 ([#4])
- **Feature:** 当没有传refCode的时候则不显示“固定值”这个标签页，这个标签页用来显示参照的
- **Breaking:** 修改了`Formula`组件的两个参数
  - `refItem` -> `refCode`
  - `refText` -> `refPlaceholder`

[v0.4.0]: https://github.com/yyssc/ssc-formula/compare/v0.3.9...v0.4.0
[#4]: https://github.com/yyssc/ssc-grid/issues/4

## [v0.3.9]
> 2017-05-23

- **Bugfix:** 修复`PropTypes`废弃的警告 ([#3])

[v0.3.9]: https://github.com/yyssc/ssc-formula/compare/v0.3.8...v0.3.9
[#3]: https://github.com/yyssc/ssc-grid/issues/3

## [v0.3.8]
> 2017-04-25

- **Bugfix:** 固定值 支持编码搜索

[v0.3.8]: https://github.com/yyssc/ssc-formula/compare/v0.3.7...v0.3.8

## [v0.3.7]
> 2017-04-24

- **Bugfix:** 使用react-bootstrap提供的`<Tab>`组件来实现tab页

[v0.3.7]: https://github.com/yyssc/ssc-formula/compare/v0.3.6...v0.3.7

## [v0.3.6]
> 2017-04-24

- **Bugfix:** 公式编辑器 修改config
- **Chore:** 添加`CHANGELOG.md`

[v0.3.6]: https://github.com/yyssc/ssc-formula/compare/v0.3.5...v0.3.6

## [v0.3.5]
> 2017-04-24

- **Feature:** 公式编辑器 参照显示code name
- **Bugfix:** 修复参照后端地址的传值
- **Chore:** 更新发布方法

[v0.3.5]: https://github.com/yyssc/ssc-formula/compare/v0.3.4...v0.3.5
