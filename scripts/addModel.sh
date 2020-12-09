#!/usr/bin/env bash

# usage:
# ./scripts/addModel.sh $(pwd) ${model}
# ./scripts/addModel.sh $(pwd) DiseaseSubject
path=$1
model=$2
model=`echo ${model:0:1} | tr  '[a-z]' '[A-Z]'`${model:1}
modelVar=`echo ${model:0:1} | tr '[A-Z]' '[a-z]'`${model:1}
filename=`echo ${modelVar} | sed 's/\([A-Z]\)/_\L\1/g'`

scriptPath=`cd $(dirname $0); pwd -P`
echo $scriptPath
tplDir=${scriptPath}/tpl

modelFile="${path}/src/models/${filename}.js"


if [ -z "$model" ]; then
    echo "Error: model is empty"
    exit -1
fi

if [ -f "${modelFile}" ];then
    echo "Warning: file exists ${modelFile}"
    exit -1
else
    modelFileContent=`cat $tplDir/template-model.js | sed "s#/template#/${filename}#g" | sed "s#template#${modelVar}#g"`
    echo "${modelFileContent}" > "${modelFile}"

    echo "add model file: ${modelFile}"
fi



