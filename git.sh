# !/bin/bash

# 定义颜色变量
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # 重置颜色

# 提示用户输入提交信息
read -p "请输入提交信息: " commitMessage

# 检查commitMessage是否为空
if [[ -z "$commitMessage" ]]; then
    echo -e "${RED}提交信息不能为空，脚本退出。${NC}"
    
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
read -p "按回车键或输入y继续更新，其他任意键取消: " updateVersionConfirm
if [[ ! "$updateVersionConfirm" =~ ^[Yy]?$ ]]; then
    echo -e "${RED}操作取消。${NC}"
    
fi

# 提示用户即将执行git add.操作
read -p "按回车键或输入y继续执行git add.，其他任意键取消: " addConfirm
if [[ ! "$addConfirm" =~ ^[Yy]?$ ]]; then
    echo -e "${RED}操作取消。${NC}"
    
fi

# 提示用户即将执行git commit操作
read -p "按回车键或输入y继续执行git commit，其他任意键取消: " commitConfirm
if [[ ! "$commitConfirm" =~ ^[Yy]?$ ]]; then
    echo -e "${RED}操作取消。${NC}"
    
fi

# 提示用户即将执行git tag操作
read -p "按回车键或输入y继续执行git tag，其他任意键取消: " tagConfirm
if [[ ! "$tagConfirm" =~ ^[Yy]?$ ]]; then
    echo -e "${RED}操作取消。${NC}"
    
fi

# 提示用户即将执行git push操作
read -p "按回车键或输入y继续执行git push，其他任意键取消: " pushConfirm
if [[ ! "$pushConfirm" =~ ^[Yy]?$ ]]; then
    echo -e "${RED}操作取消。${NC}"
    
fi

# 提示用户即将执行git push --tags操作
read -p "按回车键或输入y继续执行git push --tags，其他任意键取消: " pushTagsConfirm
if [[ ! "$pushTagsConfirm" =~ ^[Yy]?$ ]]; then
    echo -e "${RED}操作取消。${NC}"
    
fi

# 再次提示用户即将执行的操作
echo -e "${GREEN}即将执行以下操作:${NC}"
if [[ "$updateVersionConfirm" =~ ^[Yy]?$ ]]; then
    echo " - 更新 package.json 中的版本号为 $newVersion"
fi
if [[ "$addConfirm" =~ ^[Yy]?$ ]]; then
    echo " - 执行 git add."
fi
if [[ "$commitConfirm" =~ ^[Yy]?$ ]]; then
    echo " - 执行 git commit，提交信息为: $commitMessage (Version $newVersion)"
fi
if [[ "$tagConfirm" =~ ^[Yy]?$ ]]; then
    echo " - 执行 git tag，标签为: v$newVersion"
fi
if [[ "$pushConfirm" =~ ^[Yy]?$ ]]; then
    echo " - 执行 git push"
fi
if [[ "$pushTagsConfirm" =~ ^[Yy]?$ ]]; then
    echo " - 执行 git push --tags"
fi

read -p "按回车键或输入y继续执行，其他任意键取消: " finalConfirm
if [[ ! "$finalConfirm" =~ ^[Yy]?$ ]]; then
    echo -e "${RED}操作取消。${NC}"
    exit 1
fi

# 执行所有操作
if [[ "$updateVersionConfirm" =~ ^[Yy]?$ ]]; then
    # 更新 package.json 中的版本号
    sed -i "s/\"version\": \"$currentVersion\"/\"version\": \"$newVersion\"/" package.json
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}版本号更新成功。${NC}"
    else
        echo -e "${RED}版本号更新失败。${NC}"
        
    fi
fi

if [[ "$addConfirm" =~ ^[Yy]?$ ]]; then
    # 执行 git add.
    git add .
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}git add. 操作成功。${NC}"
    else
        echo -e "${RED}git add. 操作失败。${NC}"
        
    fi
fi

if [[ "$commitConfirm" =~ ^[Yy]?$ ]]; then
    # 执行 git commit
    git commit -m "$commitMessage (Version $newVersion)"
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}git commit 操作成功。${NC}"
    else
        echo -e "${RED}git commit 操作失败。${NC}"
        
    fi
fi

if [[ "$tagConfirm" =~ ^[Yy]?$ ]]; then
    # 执行 git tag
    git tag -a "v$newVersion" -m "Version $newVersion"
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}git tag 操作成功。${NC}"
    else
        echo -e "${RED}git tag 操作失败。${NC}"
        
    fi
fi

if [[ "$pushConfirm" =~ ^[Yy]?$ ]]; then
    # 执行 git push
    git push
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}git push 操作成功。${NC}"
    else
        echo -e "${RED}git push 操作失败。${NC}"
        
    fi
fi

if [[ "$pushTagsConfirm" =~ ^[Yy]?$ ]]; then
    # 执行 git push --tags
    git push --tags
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}git push --tags 操作成功。${NC}"
    else
        echo -e "${RED}git push --tags 操作失败。${NC}"
        
    fi
fi