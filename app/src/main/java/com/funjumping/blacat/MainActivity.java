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

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity implements IResultListener{

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
        dvc.InitWebView(this);

//        List<String> list = new ArrayList<>();
//        list.add("123");
//        list.add("2");
//        list.add("cn");
//        BlaCatSDK.getBlaCatSDK().BlaCatSDK("initSDK", list);
//
//        List<String> list1 = new ArrayList<>();
//        list1.add("2");
//        BlaCatSDK.getBlaCatSDK().BlaCatSDK("setDefault", list1);
//
//        BlaCatSDK.getBlaCatSDK().BlaCatSDK("LoginSDK", null);
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

    @Override
    public void getLoginRes(JSONObject data) {

    }

    @Override
    public void getLogoutRes(JSONObject data) {

    }

    @Override
    public void getMakeRechargeRes(JSONObject data) {

    }

    @Override
    public void getAppNotifysRes(JSONArray data) {

    }

    @Override
    public void getConfirmAppNotifyRes(JSONObject data) {

    }

    @Override
    public void getBalanceRes(JSONObject data) {

    }

    @Override
    public void getUserInfoRes(JSONObject data) {

    }

    @Override
    public void getNetTypeRes(int data) {

    }

    @Override
    public void getInvokescriptRes(JSONObject data) {

    }

    @Override
    public void getMakeRawTransactionRes(JSONObject data) {

    }

    @Override
    public void getMakeGasTransferRes(JSONObject data) {

    }

    @Override
    public void getMakeGasTransferMultiRes(JSONObject data) {

    }

    @Override
    public void getChangeNetTypeRes(JSONObject data) {

    }
}
