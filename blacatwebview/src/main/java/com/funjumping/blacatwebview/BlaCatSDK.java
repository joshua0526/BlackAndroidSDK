package com.funjumping.blacatwebview;

import android.os.Build;
import android.webkit.ValueCallback;
import android.widget.Toast;

import org.json.JSONObject;

import java.util.ArrayList;
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
            MyWebView.getMyWebView().evaluateJavascript("javascript:BlaCatSDK('" + method + "','')", new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {

                }
            });
        }else {
            MyWebView.getMyWebView().loadUrl("javascript:BlaCatSDK('" + method + "','')");
        }
    }
    /**
     * 调用H5 SDK
     * @param method
     * @param list
     */
    public void BlaCatSDK(String method, List<String> list){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            MyWebView.getMyWebView().evaluateJavascript("javascript:BlaCatSDK('" + method + "','" + Helper.ListToString(list) + "')", new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {

                }
            });
        }else {
            MyWebView.getMyWebView().loadUrl("javascript:BlaCatSDK('" + method + "','" + Helper.ListToString(list) + "')");
        }
    }

    public void BlaCatSDKMulti(String method, List<List<String>> list){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            MyWebView.getMyWebView().evaluateJavascript("javascript:BlaCatSDK('" + method + "','" + Helper.ListToListToString(list) + "')", new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {

                }
            });
        }else {
            MyWebView.getMyWebView().loadUrl("javascript:BlaCatSDK('" + method + "','" + Helper.ListToListToString(list) + "')");
        }
    }

    /**
     *
     * @param method 交互方法名
     * @param params array传参
     * @param contractMethod 合约内部方法
     * @param contractHash 合约哈希
     * @param methodName 访问服务器方法名
     */
    public void BlaCatSDK(String method, List<String> params, String contractMethod, String contractHash, String methodName){
        List<String> list = new ArrayList<>();
        list.add(Helper.ListToString(params));
        list.add(contractMethod);
        list.add(contractHash);
        list.add(methodName);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            MyWebView.getMyWebView().evaluateJavascript("javascript:BlaCatSDK('" + method + "','" + Helper.ListToString(list) + "')", new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {

                }
            });
        }else {
            MyWebView.getMyWebView().loadUrl("javascript:BlaCatSDK('" + method + "','" + Helper.ListToString(list) + "')");
        }
    }
}
