#!/usr/bin/env bash

# usage:
# ./scripts/addService.sh $(pwd) ${model} ${apiurl}
# ./scripts/addService.sh $(pwd) Gene /report/genes
path=$1
model=$2
apiurl=$3
model=`echo ${model:0:1} | tr  '[a-z]' '[A-Z]'`${model:1}
modelVar=`echo ${model:0:1} | tr '[A-Z]' '[a-z]'`${model:1}
filename=`echo ${modelVar} | sed 's/\([A-Z]\)/_\L\1/g'`

scriptPath=`cd $(dirname $0); pwd -P`
echo $scriptPath
tplDir=${scriptPath}/tpl

serviceFile="${path}/src/services/${filename}.js"


if [ -z "$model" ]; then
    echo "Error: model is empty"
    exit -1
fi

if [ -z "$apiurl" ]; then
    echo "Error: api url is empty"
    exit -1
fi

if [ -f "${serviceFile}" ];then
    echo "Warning: file exists ${serviceFile}"
    exit -1
else
    modelFileContent=`cat $tplDir/template-service.js | sed "s#/crm/customers#${apiurl}#g"`
    echo "${modelFileContent}" > "${serviceFile}"

    echo "add model file: ${serviceFile}"
fi



