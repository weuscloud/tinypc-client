#!/bin/bash

# 提示用户输入提交信息
read -p "请输入提交信息: " commitMessage

# 检查commitMessage是否为空
if [ -z "$commitMessage" ]; then
  echo "提交信息不能为空，脚本退出。"
  exit 1
fi

# 读取当前版本号
currentVersion=$(grep -oP '(?<="version": ")[^"]*' package.json)

# 拆分版本号并增加 patch 版本号
IFS='.' read -r major minor patch <<< "$currentVersion"
patch=$((patch + 1))
newVersion="$major.$minor.$patch"

# 提示用户即将更新package.json中的版本号
echo "当前版本号: $currentVersion"
echo "新版本号: $newVersion"
read -p "按回车键或输入y继续更新，其他任意键取消: " confirm
if [[ ! "$confirm" =~ ^[Yy]?$ ]]; then
  echo "操作取消。"
  exit 1
fi

# 更新 package.json 中的版本号
sed -i "s/\"version\": \"$currentVersion\"/\"version\": \"$newVersion\"/" package.json
echo "版本号更新成功。"

# 提示用户即将执行git add.操作
read -p "按回车键或输入y继续执行git add.，其他任意键取消: " confirm
if [[ ! "$confirm" =~ ^[Yy]?$ ]]; then
  echo "操作取消。"
  exit 1
fi

# 执行 git add.
git add .
echo "git add. 操作成功。"

# 提示用户即将执行git commit操作
read -p "按回车键或输入y继续执行git commit，其他任意键取消: " confirm
if [[ ! "$confirm" =~ ^[Yy]?$ ]]; then
  echo "操作取消。"
  exit 1
fi

# 执行 git commit
git commit -m "$commitMessage (Version $newVersion)"
echo "git commit 操作成功。"

# 提示用户即将执行git tag操作
read -p "按回车键或输入y继续执行git tag，其他任意键取消: " confirm
if [[ ! "$confirm" =~ ^[Yy]?$ ]]; then
  echo "操作取消。"
  exit 1
fi

# 执行 git tag
git tag -a "v$newVersion" -m "Version $newVersion"
echo "git tag 操作成功。"

# 提示用户即将执行git push操作
read -p "按回车键或输入y继续执行git push，其他任意键取消: " confirm
if [[ ! "$confirm" =~ ^[Yy]?$ ]]; then
  echo "操作取消。"
  exit 1
fi

# 执行 git push
git push
echo "git push 操作成功。"

# 提示用户即将执行git push --tags操作
read -p "按回车键或输入y继续执行git push --tags，其他任意键取消: " confirm
if [[ ! "$confirm" =~ ^[Yy]?$ ]]; then
  echo "操作取消。"
  exit 1
fi

# 执行 git push --tags
git push --tags
echo "git push --tags 操作成功。"