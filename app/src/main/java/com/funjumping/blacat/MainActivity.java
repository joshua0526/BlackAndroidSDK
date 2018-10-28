package com.funjumping.blacat;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.JsonReader;
import android.util.JsonToken;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.funjumping.blacatwebview.BlaCatSDK;
import com.funjumping.blacatwebview.DragViewCtr;
import com.funjumping.blacatwebview.IResultListener;
import com.funjumping.blacatwebview.MyWebView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity{

    WebView myWebView = null;
    WindowManager wm = null;
    WindowManager.LayoutParams wmlay = null;

    Button tv = null;

    DragViewCtr dvc = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_main);

        dvc = new DragViewCtr(this);
        dvc.showDragCallView();
        dvc.InitWebView(listener);

//        BlaCatSDK.getBlaCatSDK().InitSDK("12", "12", listener,"cn");

    }

    @Override
    protected void onPause() {
        super.onPause();
        dvc.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        dvc.onResume();
    }

    @Override
    protected void onDestroy() {
        dvc.onDestroy();
        super.onDestroy();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (dvc.onKeyDown(keyCode, event)){
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    private IResultListener listener = new IResultListener(){
        @JavascriptInterface
        @Override
        public void callback(String json) {
            try {
                JSONObject res = new JSONObject(json);
                switch(res.getString("cmd")){
                    case "loginRes"://登陆回调
                        String loginInfo = res.getString("data");
                        break;
                    case "invokescriptRes"://合约读取调用
                        String params = res.getJSONObject("data").getString("params");
                        JSONObject result = res.getJSONObject("data").getJSONObject("res");
                        if (result.getBoolean("err") == true){
                            //执行失败
                        }else{
                            //执行成功
                            String success_data = result.getString("info");
                        }
                        break;
                    case "makeRawTransactionRes"://合约写入请求结果
                        // 回调数据格式参考invokescriptRes
                        break;
                    case "makeRechargeRes"://充值回调
                        // 回调数据格式参考invokescriptRes
                        break;
                    case "makeGasTransferRes": // GAS转账回调
                        // 回调数据格式参考invokescriptRes
                        break;
                    case "confirmAppNotifyRes": // 交易通知接收确认回调
                        // 回调数据格式参考invokescriptRes
                        break;
                    case "getBalanceRes": // 获取余额
                        JSONObject resultBalance = res.getJSONObject("data");
                        String sgas = resultBalance.getString("sgas");
                        String gas = resultBalance.getString("gas");
                        break;
                    case "getUserInfoRes": // 获取登录用户信息
                        String userInfo = res.getString("data");
                        break;
                    case "getNetTypeRes": // 获取网络类型
                        int net_type = res.getInt("data");
                        if (net_type == 1) {
                            // 主网
                        }
                        else if (net_type == 2) {
                            // 测试网
                        }
                        break;
                    case "changeNetTypeRes": // 网络切换回调
                        int change_net_type = res.getInt("data");
                        if (change_net_type == 1) {
                            // 主网
                        }
                        else if (change_net_type == 2) {
                            // 测试网
                        }
                        break;
                    case "getAppNotifysRes": // 交易成功回调
                        JSONArray data = res.getJSONArray("data");
                        for (int i=0; i< data.length(); i++ ){
                            JSONObject txResult = (JSONObject) data.get(i);
                            String txid = txResult.getString("txid");
                            //BlackCat.SDK.confirmAppNotify({txid: txid})
                        }
                        break;
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    };
}
