package com.funjumping.blacat;

import android.content.Intent;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.Toast;

import com.funjumping.blacatwebview.BlaCatSDK;
import com.funjumping.blacatwebview.DragViewCtr;
import com.funjumping.blacatwebview.Helper;
import com.funjumping.blacatwebview.IResultListener;
import com.funjumping.blacatwebview.WebViewListener;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity implements IResultListener,WebViewListener {

    DragViewCtr dvc = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_main);

        dvc = new DragViewCtr(this);
        dvc.showDragCallView();
        dvc.InitWebView();
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
        super.onDestroy();
        dvc.onDestroy();
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
        Toast.makeText(this, data.toString(), Toast.LENGTH_LONG).show();
    }

    @Override
    public void getLogoutRes(JSONObject data) {
        Toast.makeText(this, data.toString(), Toast.LENGTH_LONG).show();
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

    @Override
    public void WebViewComplite() {
        List<String> list = new ArrayList<>();
        list.add("1000121");
        list.add("1");
        list.add("cn");
        BlaCatSDK.getBlaCatSDK().BlaCatSDK("initSDK", list);

        List<String> list1 = new ArrayList<>();
        list1.add("2");
        BlaCatSDK.getBlaCatSDK().BlaCatSDK("setDefaultNetType", list1);

        BlaCatSDK.getBlaCatSDK().BlaCatSDK("LoginSDK");


//        List<String> sbParamJson = new ArrayList<>();
//        sbParamJson.add("(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT");
//        sbParamJson.add("(address)AWPVmAobCJGxrupvQSnovofakaVb2ue65a");
//        sbParamJson.add("(integer)100000");
//        List<String> list2 = new ArrayList<>();
//        list2.add(Helper.ListToString(sbParamJson));
//        list2.add("transfer");
//        list2.add("0x3f7420285874867c30f32e44f304fd62ad1e9573");
//        list2.add("makeRawTransaction");
//        BlaCatSDK.getBlaCatSDK().BlaCatSDK("makeRawTransaction", list2);

//        List<String> sbParamJson1 = new ArrayList<>();
//        sbParamJson1.add("(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT");
//        sbParamJson1.add("(address)AWPVmAobCJGxrupvQSnovofakaVb2ue65a");
//        sbParamJson1.add("(integer)100000");
//        BlaCatSDK.getBlaCatSDK().BlaCatSDK("makeRawTransaction", sbParamJson1, "transfer", "0x3f7420285874867c30f32e44f304fd62ad1e9573", "makeRawTransaction");
//
//        List<List<String>> listarray = new ArrayList<>();
//        for (int i = 0; i < 5; i++){
//            List<String> tempList = new ArrayList<>();
//            tempList.add("toaddr");
//            tempList.add("count");
//            tempList.add("makeGasTransferMulti1");
//            listarray.add(tempList);
//        }
//        BlaCatSDK.getBlaCatSDK().BlaCatSDKMulti("makeGasTransferMulti", listarray);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        dvc.myWebView.onActivityResult(requestCode,resultCode,data);
    }
}
