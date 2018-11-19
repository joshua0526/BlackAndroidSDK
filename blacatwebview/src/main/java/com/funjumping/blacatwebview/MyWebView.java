package com.funjumping.blacatwebview;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

public class MyWebView extends WebView{
    public Activity mContext = null;
    public WindowManager.LayoutParams params = null;
    private static MyWebView myWebView = null;
    private AndroidJavaScript androidJavaScript = null;

    private MyWebView(Activity context){
        super(context);
        mContext = context;
    }

    public static MyWebView getMyWebView(Activity context){
        if (myWebView == null){
            myWebView = new MyWebView(context);
        }
        return myWebView;
    }

    @Override
    public void destroy() {
        super.destroy();
        myWebView = null;
    }

    public static MyWebView getMyWebView(){
        return myWebView;
    }

    MyWebChromeClient mwcc = new MyWebChromeClient(mContext);
    public void Init(){
        myWebView.setWebChromeClient(mwcc);
        myWebView.setWebViewClient(new WebViewClient(){
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                webViewListener.WebViewComplite();
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.proceed();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
            }
        });
        setWebSettings();
        myWebView.loadUrl("file:///android_asset/index.html");
        myWebView.setBackgroundColor(Color.TRANSPARENT);
        myWebView.requestFocus();

        myWebView.addJavascriptInterface(androidJavaScript, "AndroidSDK");

        params = new WindowManager.LayoutParams(WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT);
        params.type = WindowManager.LayoutParams.TYPE_APPLICATION_SUB_PANEL;
//        params.gravity = Gravity.CENTER;
        mContext.addContentView(myWebView, params);
        myWebView.setVisibility(View.GONE);
    }

    WebViewListener webViewListener = null;
    public void AddResultListener(){
        androidJavaScript = new AndroidJavaScript((IResultListener) mContext);
        webViewListener = (WebViewListener) mContext;
    }

    private void setWebSettings(){
        WebSettings webSettings = myWebView.getSettings();
        //如果访问的页面中要与Javascript交互，则webview必须设置支持Javascript
        webSettings.setJavaScriptEnabled(true);
        //支持插件
        //webSettings.setPluginState(WebSettings.PluginState.ON);

//        //设置自适应屏幕，两者合用
//        webSettings.setUseWideViewPort(true); //将图片调整到适合webview的大小
//        webSettings.setLoadWithOverviewMode(true); // 缩放至屏幕的大小

        webSettings.setDomStorageEnabled(true);//支持HTML5 DOM Storage
        webSettings.setDefaultTextEncodingName("utf-8");//设置编码格式

        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP){
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
    }

    public void Show(){
        if (myWebView.getVisibility() == View.VISIBLE){
            myWebView.setVisibility(View.GONE);
        }else {
            myWebView.setVisibility(View.VISIBLE);
        }

    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        mwcc.onActivityResult(requestCode,resultCode,data);
    }
}
