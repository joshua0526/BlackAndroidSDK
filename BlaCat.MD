* [<strong>BlaCatSDK使用文档</strong>](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#blacatsdk使用文档)
* [<strong>BlaCatSDK Usage Documentation</strong>](https://github.com/FunJumping/NeoGameSDK_TS/blob/master/BlaCat_en.md#blacatsdk-usage-documentation)
	* [一、BlaCat简介](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#一blacat简介)
	* [二、基础应用](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#二基础应用)
		* [1、引入SDK](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#1引入sdk)
		* [2、初始化SDK（init）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#2初始化sdkinit)
		* [3、登录（login）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#3登录login)
		* [4、充值](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#4充值)
			* [1）、发起充值（makeRecharge）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#1发起充值makerecharge)
			* [2）、确认充值（前端）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#2确认充值前端)
				* [1））、交易链上处理完成回调（getAppNotifysRes）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#1交易链上处理完成回调getappnotifysres)
				* [2））、确认收到（confirmAppNotify）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#2确认收到confirmappnotify)
			* [3）、确认充值（后端）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#3确认充值后端)
				* [1））、接口说明](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#1接口说明)
				* [2））、sign签名算法](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#2sign签名算法)
				* [3））、sign签名算法（PHP）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#3sign签名算法php)
		* [5、获取余额（getBalance）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#5获取余额getbalance)
		* [6、获取用户信息（getUserInfo）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#6获取用户信息getuserinfo)
		* [7、获取当前网络类型（getNetType）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#7获取当前网络类型getnettype)
		* [8、GAS转账（makeGasTransfer）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#8gas转账makegastransfer)
		* [9、GAS批量转账（makeGasTransferMulti）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#9gas批量转账makegastransfermulti)
	* [三、进阶应用](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#三进阶应用)
		* [1、智能合约调用方式](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#1智能合约调用方式)
		* [2、合约读取（invokescript）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#2合约读取invokescript)
		* [3、合约写入（makeRawTransaction）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#3合约写入makerawtransaction)
	* [四、辅助功能](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#四辅助功能)
		* [1、设置SDK语言（setLang）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#1设置sdk语言setlang)
		* [2、设置初始默认网络（setDefaultType）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#2设置初始默认网络setdefaulttype)
		* [3、展开/缩略SDK（showMain/showIcon）](https://github.com/joshua0526/BlackAndroidSDK/blob/master/BlaCat.MD#3展开缩略sdkshowmainshowicon)

# **BlaCatSDK使用文档**

本文讲述如何使用BlaCatSDK(NeoGameSDK)接入NEO公链。

## 一、BlaCat简介
BlaCat是基于NEO高性能侧链的链游平台，平台业务主要包括：钱包、交易市场、游戏平台、用户社区。BlaCat最大的技术特点是ZoroChain，它提供了一套面向高速DApp开发的整体区块链技术解决方案。

## 二、基础应用
### 1、引入SDK
* 要使用BlaCatSDK，需要把blacatwebview打包成aar文件，android studio里面gradle里面配置了makeJar1，双击执行自动打包，文件生成位置blacatwebview/build/outputs/aar/文件夹下。
* unity导出android工程，libs文件夹下引用aar文件。
* AndroidManifest.xml文件添加权限
```
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
```
* UnityPlayerActivity创建对象`DragViewCtr dvc = null`,并在onCreate方法里赋值
```
    dvc = new DragViewCtr(this);
    dvc.showDragCallView();
    dvc.InitWebView(this, this);
```
* UnityPlayerActivity实现接口`implements IResultListener,WebViewListener`获取返回值。
### 2、初始化SDK（init）
BlaCatSDK使用前，需要执行初始化操作，在方法WebViewComplite调用。
```
List<String> list = new ArrayList<>();
list.add(appid);
list.add(appkey);
list.add(lang);
BlaCatSDK.getBlaCatSDK().BlaCatSDK("initSDK", list);
```
**参数说明：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|appid |是  |string |BlaCat分配的appid   |
|appkey |是  |string |BlaCat分配的appkey   |
|lang |否  |string |SDK语言，默认cn（中文），可取值cn、en   |
**返回说明：** 
无返回

**回调方式说明：** 
BlaCatSDK支持两种回调方式，一种是初始化SDK时（init）注册回调函数方式（推荐），一种是函数回调方式。有些功能回调，比如切换网络类型通知、交易确认完成通知等，只能通过方式一。

回调方式就是上面实现IResultListener接口，方法如下：
```
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
```

### 3、登录（login）
需要先初始化（init）后才能调用。
``` 
  BlaCatSDK.getBlaCatSDK().BlaCatSDK("LoginSDK");
```

**返回说明：** 
``` 
{
	"g_id": "5",
	"time": 1531891115,
	"uid": "sj_xxs23",
	"wallet": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
	"sign": "40d48798189ec210153339d7a1cf71e5"
}
```

**特别说明：** 
接口返回的数据，需要在应用服务端验证数据有效性，不能在客户端上做登录验证

**返回参数说明：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|g_id |是  |string |即应用ID（appid），BlaCat分配   |
|uid |是  |string | BlaCat用户uid    |
|time     |是  |string | 登录时间戳，单位秒    |
|wallet     |是  |string | 用户钱包地址    |
|sign     |是  |string | 请求签名    |

**sign验证方法：** 
参数按照字典升序排列
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT
```
添加应用签名`登录key`（BlaCat分配）
```
g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222
```

计算md5（小写）
```
md5("g_id=1&time=1528371487&uid=sj_5mqbokfwk328&wallet=AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT222")
```
得出sign
`860b5f9f52a9f07e961f2454e0e89bbe`

**sign生成方法（PHP）：** 
```
function getLoginSign($params, $login_key) {
	ksort($params);
	$md5_str = http_build_query($params) . $login_key;
	return md5($md5_str);
}
```

### 4、充值
#### 1）、发起充值（makeRecharge）
应用客户端调用发起充值接口，发起链上支付交易。
``` 
List<String> list = new ArrayList<>();
list.add(count);
list.add(extString);
BlaCatSDK.getBlaCatSDK().BlaCatSDK("makeRecharge", list);
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|count |是  |string |需要转换sgas的数量   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
"params": {
    "count": "0.001",
    "extString": "makeRecharge",
    "nnc": "0x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54",
    "sbParamJson": [
        "(address)AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
        "(address)ASZzR4Qm7iVbdUnLrRA7vBMEoX1dnmXeQe",
        "(integer)100000"
    ],
    "sbPushString": "transfer"
},
"res": {
    "err": false,
    "info": {
        "txid": "0x0bc5dddcde95b4de9f81cb39e06d43ab157d62ed6fb4e12b49e1a6aa76e22c93"
    }
} 
```
**返回说明**
此回调表示充值请求已经上链，等待NEO链进行确认。NEO链确认有可能成功，也有可能失败。

#### 2）、确认充值（前端）
如果充值成功，BlaCatSDK的后端服务器会通知应用后端充值回调接口，同时BlaCatSDK也会给前端初始化注册的listener一个交易链上处理完成回调（getAppNotifysRes）回调。

##### 1））、交易链上处理完成回调（getAppNotifysRes）
getAppNotifysRes回调是通过BlaCatSDK执行的交易都会收到的一个回调，该回调表示此交易已经在链上处理完成了。如果回调结果state=0，表示链上执行交易失败。如果回调结果state=1，应用还应该再判断自身逻辑的执行结果来确定最终执行结果。这个回调只表示该交易已经在链上处理完成。

**返回示例**

``` 
[
    {
        "id": "367",
        "g_id": "5",
        "txid": "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32",
        "state": "1",
        "params": "{\"sbPushString\":\"transfer\", \"toaddr\":\"AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5\", \"count\": \"0.01\"}"
    }
]
```
##### 2））、确认收到（confirmAppNotify）
当应用获取到getAppNotifysRes回调，处理对应前端逻辑后，应该确认收到交易链上处理完成回调。如果不做确认处理，下次用户登录游戏，还会再次收到getAppNotifysRes回调
``` 
List<String> list = new ArrayList<>();
list.add(txid);
BlaCatSDK.getBlaCatSDK().BlaCatSDK("confirmAppNotify", list);
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|txid |是  |String |交易txid   |

**返回示例**

``` 
{
    "params": {
        "txid": "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32"
    },
    "res": {
        "err": false,
        "info": 1
    }
}
```

#### 3）、确认充值（后端）
如果充值成功，BlaCatSDK的后端服务器会通知应用后端充值回调接口
##### 1））、接口说明
**请求URL：** 
- ` http://应用充值回调接口 `
  
**请求方式：**
- POST 

**参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|g_id |是  |string |应用id，NEOGAME分配   |
|txid |是  |string |交易txid   |
|from |是  |string | 发起支付的钱包地址    |
|count     |是  |string | 支付sgas数量    |
|tm     |是  |string | 请求时间戳，单位秒    |
|params|是|String|请求参数params，JSON|
|net_type|是|String|网络类型。主网：1，测试网：2|
|sign     |是  |string | 请求签名    |


 **备注** 

- 当成功发送交易确认后，将不再发起通知
- 如果发送通知失败，将尝试多次发送。

##### 2））、sign签名算法

交易确认通知POST参数按照字典升序排列
```
count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71
```
添加应用签名`支付key`（NEOGAME分配）
```
count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71&key=222
```
计算md5（小写）
```
md5("count=0.001&from=AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU&g_id=6&net_type=2&params=%7B%22count%22%3A%220.001%22%2C%22extString%22%3A%22makeRecharge%22%2C%22nnc%22%3A%220x2761020e5e6dfcd8d37fdd50ff98fa0f93bccf54%22%2C%22sbParamJson%22%3A%5B%22%28address%29AMgPM4VyYxoaoRcLXQLtyo2mRmrb3Us9NU%22%2C%22%28address%29AFuzEa913voSXEenPqPCDgEuvhB3dAenqw%22%2C%22%28integer%29100000%22%5D%2C%22sbPushString%22%3A%22transfer%22%7D&tm=1533559801&txid=0xce91599a94e405e09ed3e02e782c57fd32578769e11ff75382fd033c0fca5a71&key=222")
```
得出sign
`bda7145c6d139ec3149bea6140aae883`
##### 3））、sign签名算法（PHP）
```
function getNotifySign($params, $key)
{
    ksort($params);
    $md5_str = http_build_query($params).'&key='.$key;
    return md5($md5_str);
}
```

### 5、获取余额（getBalance）
获取当前用户的sgas和gas余额
``` 
BlaCatSDK.getBlaCatSDK().BlaCatSDK("getBalance");
```

**返回示例**

``` 
{
	"sgas": 0,
	"gas": 1
}
```

### 6、获取用户信息（getUserInfo）
获取当前用户的基础信息
``` 
BlaCatSDK.getBlaCatSDK().BlaCatSDK("getUserInfo");
```

**返回示例**

``` 
{
  "uid": "sj_xxs23",
  "name": "136****3882",
  "invitor": "",
  "ip": "11.11.11.11",
  "lastlogin": "1531492354",
  "token": "6468aed6ea4f2e7add4d11ee84c6fd4a",
  "jifen": "0",
  "wallet": "AbYR3eUbPUcnenEfmbJ7Fc4DUZLabKD6Cf",
  "region": "CN",
  "area": "",
  "email": "",
  "qq": "",
  "icon": ""
}
```


### 7、获取当前网络类型（getNetType）
获取当前网络类型，1表示主网，2表示测试网
``` 
BlaCatSDK.getBlaCatSDK().BlaCatSDK("getNetType");
```

**返回示例**

``` 
2
```

### 8、GAS转账（makeGasTransfer）
执行GAS转账操作，该调用需要钱包用户签名。
``` 
List<String> list = new ArrayList<>();
list.add(toaddr);
list.add(count);
list.add(extString);
BlaCatSDK.getBlaCatSDK().BlaCatSDK("makeGasTransfer", list);
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|toaddr |是  |String |转账收款地址   |
|count |是  |string |转账数量   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
方式一：
{
    "params": {
        "toaddr": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
        "count": "0.01",
        "extString": "makeGasTransfer"
    },
    "res": {
        "err": false,
        "info": "340645e5f0307c285c19c54bc245935ce5dcef5a284bcb86a11e91ac7f80da32"
    }
}
```

### 9、GAS批量转账（makeGasTransferMulti）
执行GAS批量转账操作，该调用需要钱包用户签名。
``` 
List<String> list = new ArrayList<>();
for (int i = 0; i < 5; i++){
    List<String> tempList = new ArrayList<>();
    tempList.add(toaddr);
    tempList.add(count);
    tempList.add(extString);
    list.add(tempList.toString());
}
BlaCatSDK.getBlaCatSDK().BlaCatSDKMulti("makeGasTransferMulti", list);
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|toaddr |是  |String |转账收款地址   |
|count |是  |string |转账数量   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
方式一：
{
    "params": [
        {
            "toaddr": "AbYR3eUbPUcnenEfmbJ7Fc4DUZLabKD6Cf",
            "count": "0.001",
            "extString": "makeGasTransferMulti1",
            "sbPushString": "transfer"
        },
        {
            "toaddr": "AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT",
            "count": "0.002",
            "extString": "makeGasTransferMulti2",
            "sbPushString": "transfer"
        }
    ],
    "res": {
        "err": false,
        "info": "c23537c41751e5a96621a1bf1c077d854ef522087b5fc9b245bf22e97f9e4451"
    }
}
```

## 三、进阶应用
### 1、智能合约调用方式
一般情况下，智能合约调用分为两种，一种是合约读取请求（invokescript），一种是合约写入请求(makeRawTransaction)。读取请求不做任何修改，只是单纯的读取相关数据。写入请求会做数据变更，需要用户授权签名。我们的充值请求，属于合约写入请求，是需要用户打开钱包进行请求授权签名才能执行的。
### 2、合约读取（invokescript）
以只读方式读取智能合约信息，该调用不需要钱包用户签名即可调用。
``` 
List<String> sbParamJson = new ArrayList<>();
sbParamJson.add("(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT");
List<String> list = new ArrayList<>();
list.add(sbParamJson.toString());
list.add(sbPushString);
list.add(nnc);
list.add(extString);
BlaCatSDK.getBlaCatSDK().BlaCatSDK("invokeScript", list);
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|sbParamJson |是  |Array |合约参数数组   |
|sbPushString |是  |string |合约方法名   |
|nnc |是  |string |合约地址   |
|extString |是  |string |透传参数  |

**返回示例**

``` 
// 方式一
 {
    "params": {
        "nnc": "0xcfe8f6824365f70d382733a92d8f373ee4faf222",
        "sbParamJson": [
            "(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT"
        ],
        "sbPushString": "balanceOf",
        "extString": "invokeScript"
    },
    "res": {
        "err": false,
        "info": {
            "script": "14ba42009c9f422111ca847526b443467fc6483f3651c10962616c616e63654f666722f2fae43e378f2da93327380df7654382f6e8cf",
            "state": "HALT, BREAK",
            "gas_consumed": "0.326",
            "stack": [
                {
                    "type": "ByteArray",
                    "value": ""
                }
            ]
        }
    }
}
```

### 3、合约写入（makeRawTransaction）
以写方式操作智能合约，该调用需要钱包用户签名。
``` 
  var params = {
      sbParamJson: ["(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT","(address)AWPVmAobCJGxrupvQSnovofakaVb2ue65a","(integer)100000"],
      sbPushString: "transfer",
      nnc: "0x3f7420285874867c30f32e44f304fd62ad1e9573",
	  extString: "makeRawTransaction"
  };
List<String> sbParamJson = new ArrayList<>();
sbParamJson.add("(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT");
sbParamJson.add("(address)AWPVmAobCJGxrupvQSnovofakaVb2ue65a);
sbParamJson.add("(integer)100000");
List<String> list = new ArrayList<>();
list.add(sbParamJson.toString());
list.add(sbPushString);
list.add(nnc);
list.add(extString);
BlaCatSDK.getBlaCatSDK().BlaCatSDK("makeRawTransaction", list);
```
**params参数：** 

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|sbParamJson |是  |Array |合约参数数组   |
|sbPushString |是  |string |合约方法名   |
|nnc |是  |string |合约地址   |
|extString |是  |string |getAppNotifysRes透传参数  |

**返回示例**

``` 
{
    "params": {
        "nnc": "0x3f7420285874867c30f32e44f304fd62ad1e9573",
        "sbParamJson": [
            "(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT",
            "(address)AWPVmAobCJGxrupvQSnovofakaVb2ue65a",
            "(integer)100000"
        ],
        "sbPushString": "transfer",
        "extString": "makeRawTransaction"
    },
    "res": {
        "err": false,
        "info": {
            "txid": "0x0478bc0bb5757db60d1a1a6c5f774d1a33be5b493156788043712585e7abb779"
        }
    }
}
```

## 四、辅助功能
### 1、设置SDK语言（setLang）
设置当前SDK语言，可选cn、en
``` 
List<String> list = new ArrayList<>();
list.add(Lang);
BlaCatSDK.getBlaCatSDK().BlaCatSDK("Language", list);
```
### 2、设置初始默认网络（setDefaultType）
设置初始默认网络类型（1：主网；2：测试网）
``` 
List<String> list = new ArrayList<>();
list.add(netNum);
BlaCatSDK.getBlaCatSDK().BlaCatSDK("setDefaultNetType", list);
```









