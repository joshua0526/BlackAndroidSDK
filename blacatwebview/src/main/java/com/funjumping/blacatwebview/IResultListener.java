package com.funjumping.blacatwebview;

import org.json.JSONArray;
import org.json.JSONObject;

public interface IResultListener {
    /**
     * 登陆回调
     * @param data 登陆回调返回值
     */
    void getLoginRes(JSONObject data);
    /**
     * 登出回调
     * @param data
     */
    void getLogoutRes(JSONObject data);

    /**
     * 充值回调
     * @param data
     */
    void getMakeRechargeRes(JSONObject data);

    /**
     * 交易链上处理完成回调
     * @param data
     */
    void getAppNotifysRes(JSONArray data);

    /**
     * 交易链上处理完成回调接收确认回调
     * @param data
     */
    void getConfirmAppNotifyRes(JSONObject data);

    /**
     * 获取余额
     * @param data
     */
    void getBalanceRes(JSONObject data);

    /**
     * 获取登录用户信息
     * @param data
     */
    void getUserInfoRes(JSONObject data);
    /**
     * 获取网络类型
     * @param data
     */
    void getNetTypeRes(int data);
    /**
     * 合约读取调用
     * @param data
     */
    void getInvokescriptRes(JSONObject data);
    /**
     * 合约写入请求结果
     * @param data
     */
    void getMakeRawTransactionRes(JSONObject data);
    /**
     * GAS转账回调
     * @param data
     */
    void getMakeGasTransferRes(JSONObject data);
    /**
     * GAS批量转账回调
     * @param data
     */
    void getMakeGasTransferMultiRes(JSONObject data);
    /**
     * 网络切换回调
     * @param data
     */
    void getChangeNetTypeRes(JSONObject data);
}
