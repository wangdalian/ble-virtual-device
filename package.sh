set -x
APP_NAME=bleVirtualDevice
APP_VERSION=1.0

BUILD_ROOT=/tmp/build
APP_BUILD_PATH=$BUILD_ROOT/$APP_NAME.$APP_VERSION
APP_CONF_PATH=$APP_BUILD_PATH/root/config/$APP_NAME
APP_SRC_PATH=$APP_BUILD_PATH/apps/$APP_NAME

# 初始目录
rm -rf $APP_BUILD_PATH && \
  mkdir -p $APP_BUILD_PATH && \
  mkdir -p $APP_CONF_PATH && \
  mkdir -p $APP_SRC_PATH

# 启动脚本
cp ./script/autorun.sh $APP_BUILD_PATH

# app代码
cp -R * $APP_SRC_PATH
mv $APP_SRC_PATH/bin/usr $APP_BUILD_PATH/usr

# 移除无效代码
rm -rf $APP_SRC_PATH/node_modules
rm $APP_SRC_PATH/package.sh
rm -rf $APP_SRC_PATH/udp_c_src/
rm -rf *.code-workspace

# app配置
#cp ./config/meta.json $APP_CONF_PATH

# 安装依赖
cd $APP_SRC_PATH
which "yarn" > /dev/null
if [ $? -eq 0 ]
then
  yarn install
else
  npm install
fi

# 根据系统类型替换bleno依赖
rm -rf ./node_modules/bleno

cd -

# 打包
cd $BUILD_ROOT
tar -czvf $APP_NAME.$APP_VERSION.tar.gz $APP_NAME.$APP_VERSION

# 返回目录
cd -
