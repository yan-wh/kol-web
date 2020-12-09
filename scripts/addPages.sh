#!/usr/bin/env bash

# usage:
# ./scripts/addPages.sh $(pwd) ${model} ${route} ${title}
# ./scripts/addPages.sh $(pwd) DiseaseSubject /report/setting/disease-subjects 疾病系统
path=$1
model=$2
route=$3
title=$4
model=`echo ${model:0:1} | tr  '[a-z]' '[A-Z]'`${model:1}
modelVar=`echo ${model:0:1} | tr '[A-Z]' '[a-z]'`${model:1}
filename=`echo ${modelVar} | sed 's/\([A-Z]\)/_\L\1/g'`

scriptPath=`cd $(dirname $0); pwd -P`
echo $scriptPath
tplDir=${scriptPath}/tpl

pagesDir="${path}/src/pages/${model}s"

if [ -z "$model" ]; then
    echo "Error: model is empty"
    exit -1
fi
if [ -z "$route" ]; then
    echo "Error: route is empty"
    exit -1
fi
if [ -z "$title" ]; then
    echo "Error: title is empty"
    exit -1
fi

if [ -d "${pagesDir}" ];then
    echo "Warning: model pages dir exists ${pagesDir}"
    exit -1
else
    # mkdir -p $pagesDir
    cp -rf $tplDir/Advanced $pagesDir

    find $pagesDir/. -type f |xargs sed -i "s#/report/setting/genes#${route}#g"
    find $pagesDir/. -type f |xargs sed -i "s#gene#${modelVar}#g"
    find $pagesDir/. -type f |xargs sed -i "s#基因#${title}#g"

    echo "add model pages dir: ${pagesDir}"
fi



