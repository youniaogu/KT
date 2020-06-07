## Other

### 一、使用 git 备份重要配置文件

最近不小心把.bash_profile 里的配置删掉，导致环境变量全部出错，ls、vi、yarn、node 等等都不能用，最后用 mac 自带的**Time Machine**还原了文件。  
所以建议大家**使用 git 记录文件**，在～(主)目录下 git init，然后将需要备份的文件 add 进去，最后 commit 打上 remark，存在**本地仓库**就可以了。
