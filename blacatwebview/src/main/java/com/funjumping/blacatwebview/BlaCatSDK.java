package com.funjumping.blacatwebview;

import android.os.Build;
import android.webkit.ValueCallback;
import android.widget.Toast;

import org.json.JSONObject;

import java.util.List;
import java.util.Map;

public class BlaCatSDK{

    final int version = Build.VERSION.SDK_INT;

    private static BlaCatSDK blaCatSDK = null;
    public static BlaCatSDK getBlaCatSDK(){
        if (blaCatSDK == null){
            return blaCatSDK = new BlaCatSDK();
        }
        return  blaCatSDK;
    }

    public void BlaCatSDK(String method){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            MyWebView.getMyWebView().evaluateJavascript("javascript:BlaCatSDK('" + method + "')", new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {

                }
            });
        }else {
            MyWebView.getMyWebView().loadUrl("javascript:BlaCatSDK('" + method + "')");
        }
    }
    /**
     * 调用H5 SDK
     * @param method
     * @param list
     */
    public void BlaCatSDK(String method, List<String> list){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            MyWebView.getMyWebView().evaluateJavascript("javascript:BlaCatSDK('" + method + "','" + list.toString() + "')", new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {

                }
            });
        }else {
            MyWebView.getMyWebView().loadUrl("javascript:BlaCatSDK('" + method + "','" + list.toString() + "')");
        }
    }

    public void BlaCatSDKMulti(String method, List<List<String>> list){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            MyWebView.getMyWebView().evaluateJavascript("javascript:BlaCatSDK('" + method + "','" + list.toString() + "')", new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {

                }
            });
        }else {
            MyWebView.getMyWebView().loadUrl("javascript:BlaCatSDK('" + method + "','" + list.toString() + "')");
        }
    }
}
