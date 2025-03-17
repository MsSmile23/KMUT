banner(){ echo -en "\n\n----------------------------------------------------\n\t$1\n----------------------------------------------------\n\n";}

# informational banner )
ibanner(){ echo -en "\n\n----------------------------------------------------\n\t${colBlue}$1${fontNormal}\n----------------------------------------------------\n\n";}

# error banner ))
ebanner(){ echo -en "\n\n----------------------------------------------------\n\t${colRed}$1${fontNormal}\n----------------------------------------------------\n\n";}

# error banner ))
gbanner(){ echo -en "\n\n----------------------------------------------------\n\t${colGreen}$1${fontNormal}\n----------------------------------------------------\n\n";}

info(){ echo -en "\t$1";}
iinfo(){ echo -en "$1";}
iiinfo(){ printf "$1";}
mess(){ echo -en "\n${fontBold}$1${fontNormal}";}

defineColors(){
        colBlack='\E[30;40m'
        colRed='\E[31;40m'
        colGreen='\E[32;40m'
        colYellow='\E[33;40m'
        colBlue='\E[34;40m'
        colMagenta='\E[35;40m'
        colCyan='\E[36;40m'
        colWhite='\E[37;40m'

        fontBold='\E[1m'
        fontNormal='\E[0m'
}

defineColors

sendtlg (){
msg=$1
#tg options for notify
curl -s \
        -d parse_mode="html" \
        -d text="$msg" \
        -d chat_id="${TLG_CHAT_ID}" \
        -d reply_markup="" \
        https://api.telegram.org/bot${BOT_TOKEN}/sendMessage || echo "NotFine send"
}

upload-to-repo (){
        status_code=$(curl --write-out %{http_code} --silent --output curl-res.log -X POST -F "component=${REPO_COMP}" -F "packagename=${PROJECT}" -F "tree=${1}" -F "file=@${2}" ${UPLOAD_REPO_URL})
        if [[ "$status_code" -ne 200 ]] ; then 
                echo "Error upload deb";
                cat curl-res.log
                rm curl-res.log
                exit 1
        else
                echo "Upload succesfull";
        fi
}

update-repo (){
        status_code=$(curl --write-out %{http_code} --silent --output curl-res.log -X POST -F "component=${REPO_COMP}" -F "tree=${1}" ${UPDATE_REPO_URL})
        if [[ "$status_code" -ne 200 ]] ; then 
                echo "Error update repo";
                cat curl-res.log
                rm curl-res.log
                exit 1
        else
                echo "Update succesfull";
        fi 
}

tag-git-repo (){
git tag -d $1 || true
git push --delete http://${CI_USER}:${CI_TOKEN}@${CI_REPOSITORY_URL#*@} $1 || true
git tag -d latest || true
git push --delete http://${CI_USER}:${CI_TOKEN}@${CI_REPOSITORY_URL#*@} latest || true
git tag $1
git tag latest
git push --tags http://${CI_USER}:${CI_TOKEN}@${CI_REPOSITORY_URL#*@}
}
