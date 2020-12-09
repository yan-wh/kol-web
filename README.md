# antd-boilerplate

ant-design-pro 创建的样板项目


初始化前端项目的示例脚本
```
cd /apps/www/htdocs/
rm -rf ncov-web
git clone git@turing.haplox.net:hapweb/antd-boilerplate.git ncov-web
cd ncov-web
rm -rf .git

./scripts/init.sh $(pwd) hapweb ncov ncov-web

# modify the README.md
git init
git remote add origin git@turing.haplox.net:hapweb/ncov-web.git
git add .
git commit -m "Initial by hapweb/antd-boilerplate"
git push -u origin master


# add model

```