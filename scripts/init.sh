#!/usr/bin/env bash

# version: 1.0.3
# usage:
# ./scripts/init.sh $(pwd) ${namespace} ${domain} ${project}
# ${namespace} git 项目的分组名、同时也是 docker地址的分组名
# ${domain} 去发布的域名的前缀： health.hapyun.com => health
# ${project} git 项目名，一般以 -web 结尾  目录不体现 -web
# ./scripts/init.sh $(pwd) haimagene health hmshop-web
path=$1
namespace=$2
domain=$3
project=$4

if [ -z "$namespace" ]; then
    echo "Error: namespace name is empty, eg: haperp"
    exit -1
fi

if [ -z "$project" ]; then
    echo "Error: project name is empty, eg: crm"
    exit -1
fi

if [ -z "$domain" ]; then
    echo "Error: domain name is empty, eg: erp"
    exit -1
fi

module=`echo $project | sed -e "s/-web//g"`

orghelmpath="${path}/helm/antd-boilerplate"
helmpath="${path}/helm/${project}"
scriptspath="${path}/scripts"
configpath="${path}/config"
srcpath="${path}/src"
cifile="${path}/.gitlab-ci.yml"
dockerfile="${path}/Dockerfile"

if [ ! -d "$orghelmpath" ] && [ ! -d "$helmpath" ]; then
    echo "Error: helm dir is not exists"
    exit -1
fi

if [ -d "$orghelmpath" ] && [ ! -d "$helmpath" ]; then
    mv $orghelmpath $helmpath
fi

if [ ! -d "$helmpath" ]; then
    echo "Error: helm dir $helmpath is not exists"
    exit -1
fi

if [ ! -d "$scriptspath" ] && [ ! -d "$configpath" ] && [ ! -d "$srcpath" ]; then
    echo "Error: scripts or config or src dir is not exists"
    exit -1
fi

if [ ! -f "$cifile" ]; then
    echo "Error: ${cifile} is not exists"
    exit -1
fi

echo "start sed $(uname)-------------------------------"

if [ "$(uname)" = "Darwin" ];then

    echo "not suppurt Darwin....."

else

    # replace domain   src/services/user.js:24
    if [ "${domain}" != "erp" ]; then
        find ${srcpath}/services/* -type f | xargs sed -i 's#/haperp/#/'${domain}'/#g'
        find ${helmpath}/* -type f | xargs sed -i 's#erp.hapyun.com#'${domain}'.hapyun.com#g'
    fi

    # replace namespace
    if [ "${namespace}" != "haperp" ]; then
        find ${helmpath}/* $cifile -type f | xargs sed -i 's#haperp/antd-boilerplate#'${namespace}'/antd-boilerplate#g'
    fi

    # replace project     helm/ .gitlab-ci.yml
    find $helmpath/* $cifile -type f | xargs sed -i 's/antd-boilerplate/'${project}'/g'

    # replace module
    find ${helmpath}/* $configpath/* ${srcpath}/* $cifile $dockerfile -type f | xargs sed -i 's/boilerplate/'${module}'/g'

    # replace model ???

fi


