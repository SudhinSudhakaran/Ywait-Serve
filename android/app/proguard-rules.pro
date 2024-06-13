# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# Added Jenson on 17 Jan 2022 https://github.com/henninghall/react-native-date-picker#why-does-the-android-app-crash-in-production
-keep public class net.time4j.android.ApplicationStarter
-keep public class net.time4j.PrettyTime
# Added Jenson on 19 Jan 2022 https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#proguard
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep public class com.horcrux.svg.** {*;}