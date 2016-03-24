cd..
@echo off
set version=1.0.6
set src=dist\channel.txt
set channel=www\js\channel.js
set result=platforms\android\ant-build\MainActivity-release-unsigned.apk
set log=dist\log.txt
echo build start>"%log%"
for /f %%a in ('type "%src%"') do (
	echo %%a start>>"%log%"
	echo ^(function^(^){CM.info.channel^=^'%%a^'}^)^(^);>"%channel%"
	(call ionic build android --release)>>"%log%"
	jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore dist\cdf.keystore -storepass Zhongmian1 %result% cdf.keystore>>"%log%"
	if exist dist\cdfgapp-production-%version%-%%a.apk del dist\cdfgapp-production-%version%-%%a.apk
	dist\zipalign -v 4 %result% dist\cdfgapp-production-%version%-%%a.apk>>"%log%"
	echo %%a end>>"%log%"
)
