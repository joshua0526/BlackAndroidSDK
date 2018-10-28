package com.funjumping.blacatwebview;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MyWebView extends WebView{
    public Activity mContext = null;
    public WindowManager.LayoutParams params = null;
    private static MyWebView myWebView = null;

    private MyWebView(Activity context){
        super(context.getApplicationContext());
        mContext = context;
    }

    public static MyWebView getMyWebView(Activity context){
        if (myWebView == null){
            myWebView = new MyWebView(context);
        }
        return myWebView;
    }

    public static MyWebView getMyWebView(){
        return myWebView;
    }

    public void Init(){
        myWebView.setWebChromeClient(new WebChromeClient(){
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
            }

            @Override
            public boolean onJsAlert(WebView view, String url, String message, final JsResult result) {
                new AlertDialog.Builder(mContext).setTitle("JSAlert").setMessage(message)
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                result.confirm();
                            }
                        })
                        .setCancelable(false).show();
                return true;
            }

            @Override
            public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
                new AlertDialog.Builder(mContext)
                        .setTitle("JsConfirm")
                        .setMessage(message)
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                result.confirm();
                            }
                        })
                        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                result.cancel();
                            }
                        })
                        .setCancelable(false)
                        .show();
                return true;
            }

            @Override
            public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, final JsPromptResult result) {
                final EditText et = new EditText(mContext);
                et.setText(defaultValue);
                new AlertDialog.Builder(mContext)
                        .setTitle(message)
                        .setView(et)
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                result.confirm(et.getText().toString());
                            }
                        })
                        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                result.cancel();
                            }
                        })
                        .setCancelable(false)
                        .show();

                return true;
            }
        });
        myWebView.setWebViewClient(new WebViewClient(){
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.proceed();
            }
        });
        setWebSettings();
        myWebView.loadUrl("file:///android_asset/index.html");
        myWebView.setBackgroundColor(Color.TRANSPARENT);
        myWebView.requestFocus();

        //myWebView.addJavascriptInterface(new AndroidJavaScript(), "AndroidSDK");

        params = new WindowManager.LayoutParams(WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT);
        mContext.addContentView(myWebView, params);
        myWebView.setVisibility(View.GONE);
    }

    private void setWebSettings(){
        WebSettings webSettings = myWebView.getSettings();
        //如果访问的页面中要与Javascript交互，则webview必须设置支持Javascript
        webSettings.setJavaScriptEnabled(true);
        //支持插件
        webSettings.setPluginState(WebSettings.PluginState.ON);

//        //设置自适应屏幕，两者合用
//        webSettings.setUseWideViewPort(true); //将图片调整到适合webview的大小
//        webSettings.setLoadWithOverviewMode(true); // 缩放至屏幕的大小

        webSettings.setDomStorageEnabled(true);//支持HTML5 DOM Storage
        //webSettings.setAllowFileAccess(true); //设置可以访问文件
        webSettings.setDefaultTextEncodingName("utf-8");//设置编码格式

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP){
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
    }

    public void Show(){
        Toast.makeText(mContext,myWebView.getVisibility() + "", Toast.LENGTH_LONG).show();
        if (myWebView.getVisibility() == View.VISIBLE){
            myWebView.setVisibility(View.GONE);
        }else{
            myWebView.setVisibility(View.VISIBLE);
        }

        myWebView.loadUrl("javascript:a(" + 12 + ")");
    }

    IResultListener listener = new IResultListener() {
        @JavascriptInterface
        @Override
        public void getResultString(String json) {
            Toast.makeText(mContext, json, Toast.LENGTH_LONG).show();
        }
    };
}
