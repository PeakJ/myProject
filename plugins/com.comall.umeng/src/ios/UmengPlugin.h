#import <Cordova/CDV.h>

@interface UmengPlugin : CDVPlugin

- (void)share:(CDVInvokedUrlCommand*)command;
- (void)login:(CDVInvokedUrlCommand*)command;
- (void)checkAppInstalled:(CDVInvokedUrlCommand*)command;

@end
