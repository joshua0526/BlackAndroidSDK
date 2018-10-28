package com.funjumping.blacatwebview;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.DisplayMetrics;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.Toast;

public class DragViewCtr {
    private static final int MOVE_LENGH = 150;

    private int screenHeight;
    private int screenWidth;
    /**
     * 被拖动的图
     */
    private ImageButton iv_drag;
    private SharedPreferences sp;
    private Activity activity;

    public MyWebView myWebView = null;

    public DragViewCtr(Activity activity) {
        this.activity = activity;
        this.screenHeight = activity.getWindowManager().getDefaultDisplay()
                .getHeight();
        this.screenWidth = activity.getWindowManager().getDefaultDisplay()
                .getWidth();

        ViewGroup decorView = (ViewGroup) activity.getWindow().getDecorView();
        LayoutInflater factory = LayoutInflater.from(activity);
        View layout = factory.inflate(R.layout.draglayout, null);
        decorView.addView(layout);

        this.iv_drag = (ImageButton) layout.findViewById(R.id.imageview_drag);

        this.sp = activity.getSharedPreferences("config", Context.MODE_PRIVATE);
    }

    public void InitWebView(IResultListener listener){
        myWebView = MyWebView.getMyWebView(activity);
        myWebView.Init();
        myWebView.AddResultListener(listener);
    }
    /**
     * 显示可拖动的客服电话图标
     */
    public void showDragCallView() {

        this.iv_drag.setVisibility(View.VISIBLE);
        DisplayMetrics metric = new DisplayMetrics();
        activity.getWindowManager().getDefaultDisplay().getMetrics(metric);
        int width = metric.widthPixels; // 屏幕宽度（像素）
        int height = metric.heightPixels; // 屏幕高度（像素）
        int w = View.MeasureSpec.makeMeasureSpec(0,View.MeasureSpec.UNSPECIFIED);
        int h = View.MeasureSpec.makeMeasureSpec(0,View.MeasureSpec.UNSPECIFIED);
        iv_drag.measure(w, h);
        int viewheight =iv_drag.getMeasuredHeight();
        int viewwidth =iv_drag.getMeasuredWidth();
        int lastx = this.sp.getInt("lastx", width-viewwidth-30);
        int lasty = this.sp.getInt("lasty", height-viewheight-50);

        RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) this.iv_drag
                .getLayoutParams();
        params.leftMargin = lastx;
        params.topMargin = lasty;
        this.iv_drag.setLayoutParams(params);

        this.iv_drag.setOnTouchListener(new View.OnTouchListener() {
            int startX;
            int startY;
            long downTime;
            long upTime;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:// 手指第一次触摸到屏幕
                        iv_drag.setBackgroundResource(R.drawable.setting_server_drag_call);
                        this.startX = (int) event.getRawX();
                        this.startY = (int) event.getRawY();
                        downTime = System.currentTimeMillis();
                        break;
                    case MotionEvent.ACTION_MOVE:// 手指移动
                        int newX = (int) event.getRawX();
                        int newY = (int) event.getRawY();

                        int dx = newX - this.startX;
                        int dy = newY - this.startY;

// 计算出来控件原来的位置
                        int l = iv_drag.getLeft();
                        int r = iv_drag.getRight();
                        int t = iv_drag.getTop();
                        int b = iv_drag.getBottom();

                        int newt = t + dy;
                        int newb = b + dy;
                        int newl = l + dx;
                        int newr = r + dx;

                        if ((newl < 0) || (newt < 0) || (newr > screenWidth)
                                || (newb > screenHeight)) {
                            break;
                        }

// 更新iv在屏幕的位置.
                        iv_drag.layout(newl, newt, newr, newb);
                        this.startX = (int) event.getRawX();
                        this.startY = (int) event.getRawY();

                        break;
                    case MotionEvent.ACTION_UP: // 手指离开屏幕的一瞬间

                        int lastx = iv_drag.getLeft();
                        int lasty = iv_drag.getTop();
                        upTime = System.currentTimeMillis();
//                        android.util.Log.e("startX", "" + startX);
//                        android.util.Log.e("startY", "" + startY);
//                        android.util.Log.e("lastx", "" + lastx);
//                        android.util.Log.e("lasty", "" + lasty);
                        if (Math.abs(lastx - startX) < MOVE_LENGH
                                && Math.abs(lasty - startY) < MOVE_LENGH
                                && (upTime - downTime) < 150l) {
                            call();
                        }
                        SharedPreferences.Editor editor = sp.edit();
                        editor.putInt("lastx", lastx);
                        editor.putInt("lasty", lasty);
                        editor.commit();
                        iv_drag.setBackgroundResource(R.drawable.setting_server_drag_call);
                        break;
                }
                return true;
            }
        });
    }

    /**
     *
     */
    private void hideDragCallView() {
        this.iv_drag.setVisibility(View.GONE);
    }
    /**
     * 打电话
     */
    private void call() {
        if (myWebView == null){
            myWebView = MyWebView.getMyWebView(activity);
            myWebView.Init();
        }
        myWebView.Show();
    }

    public boolean onKeyDown(int keyCode, KeyEvent event){
        if (myWebView != null && (keyCode == event.KEYCODE_BACK) && myWebView.canGoBack()) {
            myWebView.goBack();
            return true;
        }else if(myWebView != null && !myWebView.canGoBack()){
            if (myWebView.getVisibility() == View.VISIBLE){
                myWebView.Show();
                return true;
            }
        }
        return false;
    }

    public void onPause(){
        if (myWebView != null)
        myWebView.getSettings().setJavaScriptEnabled(false);
    }

    public void onResume(){
        if (myWebView != null)
        myWebView.getSettings().setJavaScriptEnabled(true);
    }

    public void onDestroy(){
        if (myWebView != null){
            myWebView.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
            myWebView.clearHistory();

            ((ViewGroup)myWebView.getParent()).removeView(myWebView);
            myWebView.destroy();
            myWebView = null;
        }
    }
}

