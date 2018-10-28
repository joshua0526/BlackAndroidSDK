package com.funjumping.blacatwebview;

import android.webkit.JavascriptInterface;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class AndroidJavaScript {

    private IResultListener listener = null;
    public AndroidJavaScript(IResultListener listener){
        this.listener = listener;
    }
    @JavascriptInterface
    public void callback(String data){
        try {
            JSONObject res = new JSONObject(data);
            switch(res.getString("cmd")){
                case "loginRes"://登陆回调
                    JSONObject loginInfo = res.getJSONObject("data");
                    listener.getLoginRes(loginInfo);
                    break;
                case "logoutRes"://登出回调
                    listener.getLogoutRes(res);
                    break;
                case "invokescriptRes"://合约读取调用
                    listener.getInvokescriptRes(res.getJSONObject("data"));
                    break;
                case "makeRawTransactionRes"://合约写入请求结果
                    listener.getMakeRawTransactionRes(res.getJSONObject("data"));
                    // 回调数据格式参考invokescriptRes
                    break;
                case "makeRechargeRes"://充值回调
                    listener.getMakeRechargeRes(res.getJSONObject("data"));
                    // 回调数据格式参考invokescriptRes
                    break;
                case "makeGasTransferRes": // GAS转账回调
                    listener.getMakeGasTransferRes(res.getJSONObject("data"));
                    // 回调数据格式参考invokescriptRes
                    break;
                case "confirmAppNotifyRes": // 交易通知接收确认回调
                    listener.getConfirmAppNotifyRes(res.getJSONObject("data"));
                    // 回调数据格式参考invokescriptRes
                    break;
                case "getBalanceRes": // 获取余额
                    listener.getBalanceRes(res.getJSONObject("data"));
                    break;
                case "getUserInfoRes": // 获取登录用户信息
                    listener.getUserInfoRes(res.getJSONObject("data"));
                    break;
                case "getNetTypeRes": // 获取网络类型
                    listener.getNetTypeRes(res.getInt("data"));
                    break;
                case "changeNetTypeRes": // 网络切换回调
                    listener.getChangeNetTypeRes(res.getJSONObject("data"));
                    break;
                case "getAppNotifysRes": // 交易成功回调
                    listener.getAppNotifysRes(res.getJSONArray("data"));
                    break;
                case "makeGasTransferMultiRes":
                    listener.getMakeGasTransferMultiRes(res.getJSONObject("data"));
                    break;
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

}
