cd..
set log=dist\log.txt
call ionic build android --release>"%log%"
if exist dist\cdfgapp-release-unsigned.apk del dist\cdfgapp-release-unsigned.apk
copy platforms\android\build\outputs\apk\android-release-unsigned.apk dist\cdfgapp-release-unsigned.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore dist\cdf.keystore -storepass Zhongmian1 dist\cdfgapp-release-unsigned.apk cdf.keystore
cd dist
if exist cdfgapp.apk del cdfgapp.apk
zipalign -v 4 cdfgapp-release-unsigned.apk cdfgapp.apk
if exist cdfgapp-release-unsigned.apk del cdfgapp-release-unsigned.apk
