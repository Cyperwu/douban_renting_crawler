使用 Node.js 和 mongodb 从豆瓣租房小组爬取租房信息，并通过在命令行里进行交互来达到过滤不想看的帖子的效果
目前只支持整租和直租的过滤，并且使用的小组是豆瓣的[广州海珠租房](https://www.douban.com/group/haizhuzufang/)

# Dependencies

node mongoDB

# Usage

`npm i`

`node .` -> `queryNew` 获取最新的数据（1000条）

`help` 获取帮助信息

`ZZ` 获取整租信息

`HZ` 获取合租信息

`n` 下一页

`bl <num>` 或者 `blacklist <num>` 把列出来的某一条加入黑名单
