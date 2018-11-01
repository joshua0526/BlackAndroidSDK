/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 钱包视图
    export class PayView extends ViewBase {

        // 钱包
        wallet_addr: string
        wallet_addr_other: any
        // 余额
        gas: number;
        sgas: number;
        neo: number

        bct: number;
        bcp: number;

        btc: number
        eth: number

        listPageNum: number;
        payMyWallet: HTMLElement;
        // cli高度
        height_clis: number;
        height_nodes: number;

        private spanGas: HTMLElement;
        private spanSgas: HTMLElement;
        private spanBCP: HTMLElement;
        private spanBCT: HTMLElement;
        private spanNEO: HTMLElement;
        private spanBTC: HTMLElement;
        private spanETH: HTMLElement;
        private divHeight_clis: HTMLElement;
        private divHeight_nodes: HTMLElement;

        private token_blacat: HTMLElement;
        private token_neo: HTMLElement;
        private token_other: HTMLElement;
        private divCurrencyBlaCatlist: HTMLElement;
        private divCurrencyNEOlist: HTMLElement;
        private divCurrencyotherlist: HTMLElement;

        private divLists: HTMLDivElement;
        private divListsMore: HTMLElement;
        private divNetSelect: HTMLElement;

        private getWalletListsTimeout: number;
        private getWalletListsTimeout_min: number;
        private WalletListsNeedConfirm: boolean;
        walletListsNeedConfirmCounts: number;
        private WalletListsHashString: string;

        private s_doGetWalletLists: any;

        private wallet_btn: HTMLElement;
        private assets_btn: HTMLElement;

        reset() {
            this.gas = 0;
            this.sgas = 0;

            this.bcp = 0;
            this.bct = 0;

            this.listPageNum = 10;

            this.height_clis = 0;
            this.height_nodes = 0;

            this.getWalletListsTimeout = 20000; // 15s出块，所以最小间隔20s
            this.getWalletListsTimeout_min = 10000; // 在>1个块时间并且<3个出块时间内，最小时间
            this.WalletListsNeedConfirm = false;
            this.WalletListsHashString = "";

            this.walletListsNeedConfirmCounts = 0;

            this.clearTimeout()
        }

        start() {
            super.start()
            // 调用登录回调
            Main.loginCallback()

            // 登录完成后最小化
            // Main.viewMgr.mainView.hidden()
            // Main.viewMgr.change("IconView")
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_pay")

            //钱包标题
            var headerTitle = this.objCreate("div")
            headerTitle.classList.add("pc_header")
            this.ObjAppend(this.div, headerTitle)

            // 我的信息
            var myinfo_a = this.objCreate("a")
            myinfo_a.classList.add("iconfont", "icon-bc-touxiang")
            myinfo_a.onclick = () => {
                this.hidden()
                MyInfoView.refer = "PayView"
                Main.viewMgr.change("MyInfoView")
            }
            this.ObjAppend(headerTitle, myinfo_a)

            // nodes高度
            this.divHeight_nodes = this.objCreate("div")
            this.divHeight_nodes.classList.add("pc_payheighet", "iconfont", "icon-bc-blalian", "network")
            this.divHeight_nodes.style.top = "5px";
            this.divHeight_nodes.textContent = "n/a"
            this.divHeight_nodes.onclick = () => {
                this.hidden()
                ModifyNetworkLineView.refer = "PayView"

                ModifyNetworkLineView.defaultType = "nodes"
                Main.viewMgr.change("ModifyNetworkLineView")
            }
            this.ObjAppend(headerTitle, this.divHeight_nodes)

            // clis高度
            this.divHeight_clis = this.objCreate("div")
            this.divHeight_clis.classList.add("pc_payheighet", "iconfont", "icon-bc-neolian", "network")
            this.divHeight_clis.textContent = "n/a"
            this.divHeight_clis.onclick = () => {
                if (tools.WWW.api_clis && tools.WWW.api_clis != "") {
                    this.hidden()
                    ModifyNetworkLineView.refer = "PayView"

                    ModifyNetworkLineView.defaultType = "clis"
                    Main.viewMgr.change("ModifyNetworkLineView")
                }
            }
            this.ObjAppend(headerTitle, this.divHeight_clis)



            // 钱包标题
            var headerh1 = this.objCreate("h1")
            headerh1.textContent = Main.platName;
            this.ObjAppend(headerTitle, headerh1)

            //切换网络
            var divNetType = this.objCreate("div")
            divNetType.classList.add("pc_net", "iconfont")
            divNetType.textContent = this.getNetTypeName() //Main.langMgr.get("nettype_" + Main.netMgr.type)
            divNetType.onclick = () => {
                this.showChangeNetType()
            }
            this.ObjAppend(headerTitle, divNetType)

            this.divNetSelect = this.objCreate("div")
            this.divNetSelect.classList.add("pc_netbox")
            this.ObjAppend(headerTitle, this.divNetSelect)

            //返回游戏
            var aReturnGame = this.objCreate("i")
            aReturnGame.classList.add("pc_returngame", "iconfont", "icon-bc-fanhui1")
            aReturnGame.onclick = () => {
                BlackCat.SDK.showIcon()
            }
            this.ObjAppend(headerTitle, aReturnGame)

            // 钱包、虚拟资产按钮
            var btnbox = this.objCreate("div")
            this.ObjAppend(this.div, btnbox)
            btnbox.classList.add("pc_btnbox")
            // 钱包按钮
            this.wallet_btn = this.objCreate("button")
            this.wallet_btn.textContent = Main.langMgr.get("pay_walletbtn")
            this.wallet_btn.classList.add("pc_active")
            this.ObjAppend(btnbox, this.wallet_btn);
            this.wallet_btn.onclick = () => {
                assets.style.display = "none"
                paycard.style.display = "block"
                divCurrency.style.display = "block"
                this.divLists.style.display = "block"
                this.assets_btn.classList.remove("pc_active")
                this.wallet_btn.classList.add("pc_active")
            }
            // 虚拟资产
            this.assets_btn = this.objCreate("button")
            this.assets_btn.textContent = Main.langMgr.get("pay_assets")
            this.ObjAppend(btnbox, this.assets_btn);
            this.assets_btn.onclick = () => {
                assets.style.display = "block"
                paycard.style.display = "none"
                divCurrency.style.display = "none"
                this.divLists.style.display = "none"
                this.assets_btn.classList.add("pc_active")
                this.wallet_btn.classList.remove("pc_active")
            }

            // 虚拟资产div
            var assets = this.objCreate("div")
            assets.classList.add("pc_assets")
            this.ObjAppend(this.div, assets)
            var assets_ul = this.objCreate("ul")
            assets_ul.classList.add("pc_assetsul")
            this.ObjAppend(assets, assets_ul)
            var assets_li = this.objCreate("li")
            this.ObjAppend(assets_ul, assets_li)
            var assets_title = this.objCreate("div")
            assets_title.textContent = "疯狂角斗士"
            assets_title.classList.add("pc_assets_title")
            this.ObjAppend(assets_li, assets_title)
            var assets_balance = this.objCreate("div")
            assets_balance.classList.add("pc_assets_balance")
            this.ObjAppend(assets_li, assets_balance)
            var balanceimg = this.objCreate("div")
            balanceimg.classList.add("pc_balanceimg")
            this.ObjAppend(assets_balance, balanceimg)
            var img = this.objCreate("img") as HTMLImageElement
            img.src = "res/img/gas.png"
            this.ObjAppend(balanceimg, img)
            var balancename = this.objCreate("span")
            balancename.classList.add("pc_balancename")
            balancename.textContent = "ABC余额"
            this.ObjAppend(assets_balance, balancename)
            var balance = this.objCreate("span")
            balance.classList.add("pc_balance")
            balance.textContent = "1531515313,152156416565"
            this.ObjAppend(assets_balance, balance)
            var assets_prop = this.objCreate("div")
            assets_prop.classList.add("pc_assetsprop")
            this.ObjAppend(assets_li, assets_prop)
            for (var i = 0; i < 5; i++) {
                var prop = this.objCreate("a")
                prop.classList.add("pc_prop")
                this.ObjAppend(assets_prop, prop)
                var propimg = this.objCreate("img") as HTMLImageElement
                propimg.src = "res/img/game0.png"
                this.ObjAppend(prop, propimg)
                var propname = this.objCreate("span")
                this.ObjAppend(prop, propname)
                propname.textContent = "撒旦之力什么鬼"
            }
            var assets_more = this.objCreate("div")
            assets_more.classList.add("pc_assetsmore")
            this.ObjAppend(assets_li, assets_more)
            var more_btn = this.objCreate("button")
            more_btn.classList.add("pc_assetsmorebtn", "iconfont", "icon-bc-gengduo1")
            this.ObjAppend(assets_more, more_btn)
            // 虚拟资产div
            var assets_ul = this.objCreate("ul")
            assets_ul.classList.add("pc_assetsul")
            this.ObjAppend(assets, assets_ul)
            var assets_li = this.objCreate("li")
            this.ObjAppend(assets_ul, assets_li)

            var assets_title = this.objCreate("div")
            assets_title.textContent = "疯狂角斗士"
            assets_title.classList.add("pc_assets_title")
            this.ObjAppend(assets_li, assets_title)
            var assets_balance = this.objCreate("div")
            assets_balance.classList.add("pc_assets_balance")
            this.ObjAppend(assets_li, assets_balance)
            var balanceimg = this.objCreate("div")
            balanceimg.classList.add("pc_balanceimg")
            this.ObjAppend(assets_balance, balanceimg)
            var img = this.objCreate("img") as HTMLImageElement
            img.src = "res/img/gas.png"
            this.ObjAppend(balanceimg, img)
            var balancename = this.objCreate("span")
            balancename.classList.add("pc_balancename")
            balancename.textContent = "ABC余额"
            this.ObjAppend(assets_balance, balancename)
            var balance = this.objCreate("span")
            balance.classList.add("pc_balance")
            balance.textContent = "1531515313,152156416565"
            this.ObjAppend(assets_balance, balance)
            var assets_prop = this.objCreate("div")
            assets_prop.classList.add("pc_assetsprop")
            this.ObjAppend(assets_li, assets_prop)
            for (var i = 0; i < 5; i++) {
                var prop = this.objCreate("a")
                prop.classList.add("pc_prop")
                this.ObjAppend(assets_prop, prop)
                var propimg = this.objCreate("img") as HTMLImageElement
                propimg.src = "res/img/game0.png"
                this.ObjAppend(prop, propimg)
                var propname = this.objCreate("span")
                this.ObjAppend(prop, propname)
                propname.textContent = "撒旦之力什么鬼"
            }
            var assets_more = this.objCreate("div")
            assets_more.classList.add("pc_assetsmore")
            this.ObjAppend(assets_li, assets_more)
            var more_btn = this.objCreate("button")
            more_btn.classList.add("pc_assetsmorebtn", "iconfont", "icon-bc-gengduo1")
            this.ObjAppend(assets_more, more_btn)


            // 钱包卡片
            var paycard = this.objCreate("div")
            paycard.classList.add("pc_card")
            this.ObjAppend(this.div, paycard)

            // 详情
            var aWalletDetail = this.objCreate("a")
            aWalletDetail.classList.add("pc_mydetail", "iconfont", "icon-bc-xiangqing")
            aWalletDetail.onclick = () => {
                this.wallet_detail()
            }
            this.ObjAppend(paycard, aWalletDetail)

            // 通讯录
            var payAddressbook = this.objCreate("a")
            payAddressbook.classList.add("pc_mydetail", "iconfont", "icon-bc-tongxunlu")
            payAddressbook.onclick = () => {
                this.hidden()
                AddressbookView.refer = "PayView"
                Main.viewMgr.change("AddressbookView")
            }
            this.ObjAppend(paycard, payAddressbook)

            // 我的(缩略)钱包地址
            var divWallet = this.objCreate("div")
            divWallet.classList.add("pc_cardcon")
            divWallet.textContent = Main.user.info.wallet.substr(0, 4) + "****" + Main.user.info.wallet.substr(Main.user.info.wallet.length - 4)
            this.ObjAppend(paycard, divWallet)



            // 刷新
            var payRefresh = this.objCreate("div")
            payRefresh.classList.add("pc_cardrefresh")
            payRefresh.textContent = Main.langMgr.get("pay_refresh") // "刷新"
            payRefresh.onclick = () => {
                this.doGetBalances()
                this.doGetWalletLists(1)
            }
            this.ObjAppend(paycard, payRefresh)

            //刷新图标            
            var iRefresh = this.objCreate("i")
            iRefresh.classList.add("iconfont", "icon-bc-shuaxin")
            this.ObjAppend(payRefresh, iRefresh)


            //收款及转账
            var divWalletUser = this.objCreate("div")
            divWalletUser.classList.add("pc_cardtransaction")
            // divWalletUser.textContent = Main.user.info.name
            this.ObjAppend(paycard, divWalletUser)

            // 收款
            var butReceivables = this.objCreate("button")
            butReceivables.textContent = Main.langMgr.get("pay_received") //"收款"
            butReceivables.onclick = () => {
                this.doMakeReceivables()
            }
            this.ObjAppend(divWalletUser, butReceivables)

            // 提现
            var makeTransferObj = this.objCreate("button")
            makeTransferObj.textContent = Main.langMgr.get("pay_send") //"提现"
            makeTransferObj.onclick = () => {
                this.doMakeTransfer()
            }
            this.ObjAppend(divWalletUser, makeTransferObj)


            //代币
            var divCurrency = this.objCreate("div")
            divCurrency.classList.add("pc_currency")
            this.ObjAppend(this.div, divCurrency)


            // 代币nav
            var divCurrencyNumber = this.objCreate("div")
            divCurrencyNumber.classList.add("pc_currencynumber")
            this.ObjAppend(divCurrency, divCurrencyNumber)

            // BlaCat 代币
            this.token_blacat = this.objCreate("div")
            this.token_blacat.innerText = Main.langMgr.get("pay_coin_blacat")
            this.token_blacat.classList.add("active")
            this.token_blacat.onclick = () => {
                this.changetokenlist("blacat");
            }
            this.ObjAppend(divCurrencyNumber, this.token_blacat)
            // NEO 代币
            this.token_neo = this.objCreate("div")
            this.token_neo.innerText = Main.langMgr.get("pay_coin_neo")
            this.ObjAppend(divCurrencyNumber, this.token_neo)
            this.token_neo.onclick = () => {
                this.changetokenlist("neo");
            }
            // 其它 代币
            this.token_other = this.objCreate("div")
            this.token_other.innerText = Main.langMgr.get("pay_coin_other")
            this.ObjAppend(divCurrencyNumber, this.token_other)
            this.token_other.onclick = () => {
                this.changetokenlist("other");
            }

            // SGAS(旧)提现
            if (tools.CoinTool.id_SGAS_OLD && tools.CoinTool.id_SGAS_OLD.length > 0) {
                var bntCurrencyNumber = this.objCreate("button")
                bntCurrencyNumber.textContent = Main.langMgr.get("pay_coin_old") //"SGAS(旧)提现"
                bntCurrencyNumber.onclick = () => {
                    this.doMakeRefundOld()
                }
                this.ObjAppend(divCurrencyNumber, bntCurrencyNumber)
            }


            // Blacat代币list
            this.divCurrencyBlaCatlist = this.objCreate("div")
            this.divCurrencyBlaCatlist.classList.add("pc_currencylist")
            this.ObjAppend(divCurrency, this.divCurrencyBlaCatlist)
            // NEO代币list
            this.divCurrencyNEOlist = this.objCreate("div")
            this.divCurrencyNEOlist.classList.add("pc_currencylist")
            this.ObjAppend(divCurrency, this.divCurrencyNEOlist)
            this.divCurrencyNEOlist.style.display = "none"
            // 其它代币list
            this.divCurrencyotherlist = this.objCreate("div")
            this.divCurrencyotherlist.classList.add("pc_currencylist")
            this.ObjAppend(divCurrency, this.divCurrencyotherlist)
            this.divCurrencyotherlist.style.display = "none"


            // BCT余额
            var divBCT = this.objCreate("div")
            divBCT.innerHTML = "BCT"//"Gas"
            this.ObjAppend(this.divCurrencyBlaCatlist, divBCT)


            //BCT的问号
            var labelBCT = this.objCreate("label")
            labelBCT.classList.add("iconfont", "icon-bc-help")
            this.ObjAppend(divBCT, labelBCT)

            // 字体图标">"
            var token_icon = this.objCreate("i")
            token_icon.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(divBCT, token_icon)

            //BCT余额
            this.spanBCT = this.objCreate("span")
            this.spanBCT.textContent = "0"
            this.ObjAppend(divBCT, this.spanBCT)

            //什么是BCT
            var divBCTcon = this.objCreate("div")
            divBCTcon.classList.add("pc_bctcon")
            divBCTcon.textContent = Main.langMgr.get("pay_bct_desc") // "GAS是NEO链上的数字货币，可以通过交易所获取"
            this.ObjAppend(labelBCT, divBCTcon)


            //获取BCT余额信息按钮
            


            //BCP余额
            var divBCP = this.objCreate("div")
            divBCP.innerHTML = "BCP"//"Gas"
            this.ObjAppend(this.divCurrencyBlaCatlist, divBCP)

            //BCP的问号
            var labelBCP = this.objCreate("label")
            labelBCP.classList.add("iconfont", "icon-bc-help")
            this.ObjAppend(divBCP, labelBCP)

            // 字体图标">"
            var token_icon = this.objCreate("i")
            token_icon.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(divBCP, token_icon)

            //BCP余额
            this.spanBCP = this.objCreate("span")
            this.spanBCP.textContent = "0"
            this.ObjAppend(divBCP, this.spanBCP)

            //什么是BCP
            var divBCPcon = this.objCreate("div")
            divBCPcon.classList.add("pc_bcpcon")
            divBCPcon.textContent = Main.langMgr.get("pay_bcp_desc") // "GAS是NEO链上的数字货币，可以通过交易所获取"
            this.ObjAppend(labelBCP, divBCPcon)

            //获取BCP余额信息按钮
            divBCP.onclick = () => {
                this.doExchange("bcp");
            }

            // var makePurchaseObj = this.objCreate("button")
            // makePurchaseObj.textContent = "获取" //"购买"
            // this.ObjAppend(divBCP, makePurchaseObj)





            // NEOGas余额
            var divGas = this.objCreate("div")
            divGas.innerHTML = Main.langMgr.get("pay_gas")//"Gas"
            this.ObjAppend(this.divCurrencyNEOlist, divGas)

            //Gas的问号
            var labelGas = this.objCreate("label")
            labelGas.classList.add("iconfont", "icon-bc-help")
            this.ObjAppend(divGas, labelGas)

            // 字体图标">"
            var token_icon = this.objCreate("i")
            token_icon.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(divGas, token_icon)


            //Gas余额
            this.spanGas = this.objCreate("span")
            this.spanGas.textContent = "0"
            this.ObjAppend(divGas, this.spanGas)

            //什么是Gas
            var divSGascon = this.objCreate("div")
            divSGascon.classList.add("pc_sgascon")
            divSGascon.textContent = Main.langMgr.get("pay_gas_desc") // "GAS是NEO链上的数字货币，可以通过交易所获取"
            this.ObjAppend(labelGas, divSGascon)

            // SGas余额
            var divSGas = this.objCreate("div")
            divSGas.innerHTML = Main.langMgr.get("pay_sgas") // "SGas"
            this.ObjAppend(this.divCurrencyNEOlist, divSGas)

            //SGas的问号
            var labelSGas = this.objCreate("label")
            labelSGas.classList.add("iconfont", "icon-bc-help")
            this.ObjAppend(divSGas, labelSGas)

            // 字体图标">"
            var token_icon = this.objCreate("i")
            token_icon.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(divSGas, token_icon)


            //SGas余额
            this.spanSgas = this.objCreate("span")
            this.spanSgas.textContent = "0"
            this.ObjAppend(divSGas, this.spanSgas)

            //什么是SGas
            var divSGascon = this.objCreate("div")
            divSGascon.classList.add("pc_sgascon")
            divSGascon.textContent = Main.langMgr.get("pay_sgas_desc")
            this.ObjAppend(labelSGas, divSGascon)


            // NEO余额
            var divNEO = this.objCreate("div")
            divNEO.innerHTML = Main.langMgr.get("pay_neo") // "NEO"
            this.ObjAppend(this.divCurrencyNEOlist, divNEO)

            //NEO的问号
            // var labelNEO = this.objCreate("label")
            // labelNEO.classList.add("iconfont", "icon-bc-help")
            // this.ObjAppend(divNEO, labelNEO)

            // 字体图标">"
            var token_icon = this.objCreate("i")
            token_icon.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(divNEO, token_icon)


            //NEO余额
            this.spanNEO = this.objCreate("span")
            this.spanNEO.textContent = "0"
            this.ObjAppend(divNEO, this.spanNEO)

            //什么是NEO
            // var divNEOcon = this.objCreate("div")
            // divNEOcon.classList.add("pc_NEOcon")
            // divNEOcon.textContent = Main.langMgr.get("pay_NEO_desc") 
            // this.ObjAppend(labelNEO, divNEOcon)
            

            // BTC余额
            var divBTC = this.objCreate("div")
            divBTC.innerHTML = Main.langMgr.get("pay_btc") // "BTC"
            this.ObjAppend(this.divCurrencyotherlist, divBTC)

            //BTC的问号
            // var labelBTC = this.objCreate("label")
            // labelBTC.classList.add("iconfont", "icon-bc-help")
            // this.ObjAppend(divBTC, labelBTC)

            // 字体图标">"
            var token_icon = this.objCreate("i")
            token_icon.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(divBTC, token_icon)


            //BTC余额
            this.spanBTC = this.objCreate("span")
            this.spanBTC.textContent = "0"
            this.ObjAppend(divBTC, this.spanBTC)



            //什么是BTC
            // var divBTCcon = this.objCreate("div")
            // divBTCcon.classList.add("pc_BTCcon")
            // divBTCcon.textContent = Main.langMgr.get("pay_BTC_desc") 
            // this.ObjAppend(labelBTC, divBTCcon)

            // ETH余额
            var divETH = this.objCreate("div")
            divETH.innerHTML = Main.langMgr.get("pay_eth") // "ETH"
            this.ObjAppend(this.divCurrencyotherlist, divETH)

            //ETH的问号
            // var labelETH = this.objCreate("label")
            // labelETH.classList.add("iconfont", "icon-bc-help")
            // this.ObjAppend(divETH, labelETH)

            // 字体图标">"
            var token_icon = this.objCreate("i")
            token_icon.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(divETH, token_icon)


            //ETH余额
            this.spanETH = this.objCreate("span")
            this.spanETH.textContent = "0"
            this.ObjAppend(divETH, this.spanETH)

            //什么是ETH
            // var divETHcon = this.objCreate("div")
            // divETHcon.classList.add("pc_ETHcon")
            // divETHcon.textContent = Main.langMgr.get("pay_ETH_desc") 
            // this.ObjAppend(labelETH, divETHcon)



            // 提现
            // var makeRefundObj = this.objCreate("button")
            // makeRefundObj.textContent = Main.langMgr.get("pay_refund") //"提现"
            // makeRefundObj.onclick = () => {
            //     this.doMakeRefund()
            // }
            // this.ObjAppend(divGas, makeRefundObj)


            // 钱包记录
            this.divLists = this.objCreate("ul") as HTMLDivElement
            this.divLists.classList.add("pc_paylists")
            this.ObjAppend(this.div, this.divLists)


            

            divBCT.onclick = () => {
                this.doExchange("bct")
            }

            // gas
            divGas.onclick = () => {
                this.doExchange("gas")
            }

            // 兑换
            divSGas.onclick = () => {
                this.doExchange("cgas")
            }

            divBTC.onclick = () => {
                this.doExchange("btc")
            }
            divETH.onclick = () => {
                this.doExchange("eth")
            }


            this.doGetBalances()
            this.doGetWalletLists(1)
            // 获取高度
            this.getHeight("nodes")
            if (tools.WWW.api_clis && tools.WWW.api_clis != "") {
                this.getHeight("clis")
            }
        }

        update() {
            var isHidden = this.isHidden();
            this.reset()
            super.update()
            if (isHidden) this.hidden()
        }

        private clearTimeout() {
            if (this.s_doGetWalletLists) clearTimeout(this.s_doGetWalletLists)
        }

        async doGetBalances() {
            tools.CoinTool.initAllAsset();

            // 获得balance列表(gas)
            var balances = (await tools.WWW.api_getBalance(Main.user.info.wallet)) as tools.BalanceInfo[];
            if (balances) {
                //余额不唯空
                balances.map(item => (item.names = tools.CoinTool.assetID2name[item.asset])); //将列表的余额资产名称赋值
                await balances.forEach(
                    // 取GAS余额
                    balance => {
                        if (balance.asset == tools.CoinTool.id_GAS) {
                            this.gas = balance.balance;
                            // 判断一下有没有减号，不用科学计数法表示
                            this.spanGas.textContent = Main.getStringNumber(this.gas)
                        }
                        else if (balance.asset == tools.CoinTool.id_NEO) {
                            this.neo = balance.balance
                            this.spanNEO.textContent = Main.getStringNumber(this.neo)
                        }
                    }
                );
            }
            else {
                this.gas = 0;
                this.neo = 0;
                this.spanGas.textContent = "0";
                this.spanNEO.textContent = "0"
            }

            // 获取sgas余额
            // var nep5balances = await tools.WWW.api_getnep5balanceofaddress(tools.CoinTool.id_SGAS, Main.user.info.wallet);
            // if (nep5balances) {
            //     this.sgas = nep5balances[0]['nep5balance'];
            //     this.spanSgas.textContent = nep5balances[0]['nep5balance'].toString();
            // }
            // else {
            //     this.sgas = 0;
            //     this.spanSgas.textContent = "0";
            // }

            this.sgas = await Main.getSgasBalanceByAddress(tools.CoinTool.id_SGAS, Main.user.info.wallet)
            this.bcp = await Main.getNep5BalanceByAddress(tools.CoinTool.id_BCP, Main.user.info.wallet, 100000000)
            this.bct = await Main.getNep5BalanceByAddress(tools.CoinTool.id_BCT, Main.user.info.wallet, 10000)

            // 判断一下有没有减号，不用科学计数法表示
            this.spanSgas.textContent = Main.getStringNumber(this.sgas)
            this.spanBCP.textContent = Main.getStringNumber(this.bcp)
            this.spanBCT.textContent = Main.getStringNumber(this.bct)

            if (tools.CoinTool.id_BTC_NEP5 != "") {
                this.btc = await Main.getNep5BalanceByAddress(tools.CoinTool.id_BTC_NEP5, Main.user.info.wallet, 100000000);
                this.spanBTC.textContent = Main.getStringNumber(this.btc)
            }

            if (tools.CoinTool.id_ETH_NEP5 != "") {
                this.eth = await Main.getNep5BalanceByAddress(tools.CoinTool.id_ETH_NEP5, Main.user.info.wallet, 100000000);
                this.spanETH.textContent = Main.getStringNumber(this.eth)
            }

            // 通知其他界面更新余额
            Main.viewMgr.updateBalance()

        }
        private async doMakeRefundOld() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 获取sgas合约地址
                // 暂时以第一个合约地址为准，后续如果多个，新开view显示
                let id_SGAS = tools.CoinTool.id_SGAS_OLD[0]
                // 获取sgas余额
                // let id_SGAS_balance = "0"
                // let id_SGAS_balances = await tools.WWW.api_getnep5balanceofaddress(id_SGAS, Main.user.info.wallet);
                // if (id_SGAS_balances) {
                //     id_SGAS_balance = id_SGAS_balances[0]['nep5balance'].toString();
                // }
                let sgas = await Main.getSgasBalanceByAddress(id_SGAS, Main.user.info.wallet)
                let id_SGAS_balance = sgas.toString()

                // 打开输入数量
                ViewTransCount.transTypename1 = "SGASOLD2OLD"
                ViewTransCount.transTypename2 = "SGAS2GAS"

                ViewTransCount.transBalances = id_SGAS_balance
                ViewTransCount.refer = "PayView"
                ViewTransCount.callback = () => {
                    this.makeRefundTransaction(id_SGAS)
                }
                Main.viewMgr.change("ViewTransCount")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doMakeRefundOld()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }

        }


        private async doExchangeGAS() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开输入数量
                PayExchangeView.refer = "PayView"
                this.hidden()
                Main.viewMgr.change("PayExchangeView")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doExchangeGAS()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private async doMakeMintToken() {
            if (Main.isWalletOpen()) {
                // 打开钱包了
                // 打开输入数量
                ViewTransCount.transTypename1 = ""

                ViewTransCount.refer = "PayView"
                ViewTransCount.callback = () => {
                    if (ViewTransCount.transTypename1 == "GAS2SGAS") {
                        this.makeMintTokenTransaction()
                    } else if (ViewTransCount.transTypename1 == "SGAS2GAS") {
                        this.makeRefundTransaction()
                    }
                }
                Main.viewMgr.change("ViewTransCount")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doMakeMintToken()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        // 交换或者购买对应币种
        private async doExchange(type: string) {

            switch (type) {
                // BlaCat
                case "bct": // 获取bct （ $ -> bct ）
                    this.doExchangeBCT()
                    break
                case "bcp": // 兑换bcp（bct/neo/btc/eth -> bcp）
                    this.doExchangeBCP()
                    break
                // NEO
                case "gas": // 兑换gas bct/neo/btc/eth -> gas）
                    this.doExchangeGAS()
                    break
                case "cgas":// 转换cgas（gas <-> cgas)
                    this.doMakeMintToken()
                    break;
                case "neo": // 获取neo（直接neo转账到钱包）
                    this.doExchangeNEO()
                    break;
                // other
                case "btc": // 获取btc（显示btc交易钱包地址）
                    this.doExchangeBTC()
                    break;
                case "eth": // 获取eth（显示eth交易钱包地址）
                    this.doExchangeETH()
                    break;
            }
        }

        private async doExchangeNEO() {

            this.hidden()

            var res: any = {}
            res['data'] = {
                address: Main.user.info.wallet,
                balance: Main.viewMgr.payView.neo,
            }

            PayExchangeShowWalletView.refer = "PayView"
            PayExchangeShowWalletView.callback_params = {
                type_src: "NEO",
                data: res.data,
            }
            Main.viewMgr.change("PayExchangeShowWalletView")
        }


        private async doExchangeBCT() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开输入数量
                PayExchangeBCTView.refer = "PayView"
                this.hidden()
                Main.viewMgr.change("PayExchangeBCTView")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doExchangeBCT();
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private async doExchangeBCP() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开输入数量
                PayExchangeBCPView.refer = "PayView"
                this.hidden()
                Main.viewMgr.change("PayExchangeBCPView")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doExchangeBCP();
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private async doExchangeBTC() {
            this._doExchangeOther("btc")
        }

        private async doExchangeETH() {
            this._doExchangeOther("eth")
        }

        // 获取其他类型的交易钱包地址，注意：type是小写字符串
        async getWalletAddrOther(type: string) {
            if (!this.wallet_addr_other) {
                this.wallet_addr_other = {}
            }
            if (!this.wallet_addr_other.hasOwnProperty[type]) {
                Main.viewMgr.change("ViewLoading")
                try {
                    // 获取交易钱包地址
                    var res = await ApiTool.getOtherAddress(Main.user.info.uid, Main.user.info.token, type, Main.netMgr.type)
                }
                catch (e) {

                }
                Main.viewMgr.viewLoading.remove()

                if (!res || !res.r) {
                    // 获取失败
                    Main.showErrMsg("pay_exchange_create_wallet_fail")
                    return null
                }

                this.wallet_addr_other[type] = res.data.address
            }
            return this.wallet_addr_other[type]
        }

        // 交易钱包储值（btc/eth)，注意：type是小写字符串
        private async _doExchangeOther(type: string) {
            var address = await this.getWalletAddrOther(type)
            if (address) {
                this.hidden()
                PayExchangeShowWalletView.refer = "PayView"
                PayExchangeShowWalletView.callback_params = {
                    type_src: type.toUpperCase(),
                    data: {
                        address: address,
                        balance: this[type]
                    }
                }
                Main.viewMgr.change("PayExchangeShowWalletView")
            }
        }

        private divLists_recreate() {
            this.divLists.innerHTML = "";
            var liRecord = this.objCreate("li")
            liRecord.classList.add("pc_payrecord")
            // liRecord.innerText = Main.langMgr.get("pay_recentLists") //"近期记录"
            this.ObjAppend(this.divLists, liRecord)

            var spanRecord = this.objCreate("div")
            spanRecord.innerText = Main.langMgr.get("pay_recentLists") //"近期记录"
            this.ObjAppend(liRecord, spanRecord)

            // 更多钱包记录
            this.divListsMore = this.objCreate("button")
            this.divListsMore.classList.add("pc_paymore")
            this.divListsMore.textContent = Main.langMgr.get("more") // "更多"
            this.divListsMore.onclick = () => {
                this.hidden()
                Main.viewMgr.change("PayListMoreView")
            }
            this.divListsMore.style.display = "none"
            this.ObjAppend(liRecord, this.divListsMore)

            var iListsMore = this.objCreate("i")
            iListsMore.classList.add("iconfont", "icon-bc-sanjiaoxing")
            this.ObjAppend(this.divListsMore, iListsMore)


        }

        async doGetWalletLists(force = 0) {
            console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, force => ', force)
            if (!Main.user.info.token) {
                console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 已退出登录，本次请求取消')
                return;
            }

            if (force == 0 && this.WalletListsNeedConfirm) {
                // 外部调用获取交易列表，当前又有待确认交易，取消本次查询，等待定时器自动刷新交易列表
                console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 有定时刷新，本次请求取消')
                return;
            }

            if (this.s_doGetWalletLists) {
                clearTimeout(this.s_doGetWalletLists)
                this.s_doGetWalletLists = null
            }

            var res = await ApiTool.getWalletListss(Main.user.info.uid, Main.user.info.token, 1, this.listPageNum, Main.netMgr.type);

            if (res.r) {
                if (res.data && res.data.length > 0) {
                    Main.walletLogId = Number(res.data[0].id);
                    if (Main.walletLogId < Main.appWalletLogId || Main.walletLogId < Main.platWalletLogId) {
                        // 钱包记录数据不全，重新获取
                        console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 钱包记录要重新获取 ..')
                        this.doGetWalletLists(1);
                        return;
                    }

                    // 有无待确认交易，有的话，要重新获取
                    var hasNeedConfirm = false; // 是否有待确认的记录

                    var next_timeout = this.getWalletListsTimeout; // 下次刷新间隔
                    var curr_ts = Math.round((new Date()).getTime() / 1000); // 当前时间戳

                    this.walletListsNeedConfirmCounts = 0;
                    await res.data.forEach(
                        list => {
                            // WalletListsHashString_tmp += "[" + list.id + "_" + list.state + "]";
                            // 判断有没有待确认记录
                            if (list.state == '0') {
                                hasNeedConfirm = true;
                                this.walletListsNeedConfirmCounts += 1;

                                // 计算间隔时间
                                let last_ts = (curr_ts - list.ctm) * 1000 - Main.tsOffset
                                console.log('[BlaCat]', '[PayView]', 'doGetWalletLists, last_ts =>', last_ts)
                                if (last_ts >= this.getWalletListsTimeout && last_ts < this.getWalletListsTimeout * 3) {
                                    // 此记录持续时间超过出块时间，并且在3个出块时间内
                                    next_timeout = this.getWalletListsTimeout_min
                                }
                            }
                            else if (list.type == "2") {
                                // 平台sgas->gas，特殊处理下
                                if (list.client_notify == "0") {
                                    this.walletListsNeedConfirmCounts += 1;
                                }
                            }
                        }
                    )
                    this.WalletListsNeedConfirm = hasNeedConfirm;
                    Main.viewMgr.iconView.flushProcess(this.walletListsNeedConfirmCounts)

                    if (this.WalletListsNeedConfirm) {
                        console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 有待确认交易，轮询查询')
                        // 有待确认，自己加刷新
                        console.log('[BlaCat]', '[PayView]', 'doGetWalletLists, next_timeout =>', next_timeout)
                        this.s_doGetWalletLists = setTimeout(() => { this.doGetWalletLists(1) }, next_timeout);
                    }

                    var WalletListsHashString_tmp: string = JSON.stringify(res.data); // 记录hash  
                    if (WalletListsHashString_tmp == this.WalletListsHashString) {
                        console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 交易记录没有更新 ..')
                        return;
                    }

                    // 交易记录有更新
                    console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 交易记录有更新')
                    // console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, WalletListsHashString_tmp => ', WalletListsHashString_tmp)
                    // console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, WalletListsHashString => ', this.WalletListsHashString)

                    // 是否第一次显示
                    var isFirstShow = false;
                    if (this.WalletListsHashString == "") {
                        // 是第一次显示
                        isFirstShow = true;
                    }
                    this.WalletListsHashString = WalletListsHashString_tmp;

                    if (!isFirstShow) {
                        // 第一次显示获取的余额已经是最新的了，不用再次刷新
                        console.log("[BlaCat]", '[PayView]', 'doGetWalletLists, 交易记录有更新，刷新余额')
                        this.doGetBalances()
                    }

                    // 清理原始数据显示
                    this.divLists_recreate()

                    if (res.data && res.data.length == this.listPageNum) {
                        // 要显示更多按钮
                        this.divListsMore.style.display = ""
                    }

                    await res.data.forEach(
                        list => {

                            // li
                            var listObj = this.objCreate("li")
                            listObj.onclick = () => {
                                this.hidden()
                                PayListDetailView.refer = "PayView"
                                PayListDetailView.list = list;
                                Main.viewMgr.change("PayListDetailView")
                            }

                            // img
                            var img_div = this.objCreate("div")
                            img_div.classList.add("pc_listimg")
                            var img = this.objCreate("img") as HTMLImageElement
                            img.src = this.getListImg(list)
                            this.ObjAppend(img_div, img)
                            this.ObjAppend(listObj, img_div)

                            // appname & date
                            var content_div = this.objCreate("div")
                            content_div.classList.add("pc_liftinfo")

                            var content_name_div = this.objCreate("div")
                            content_name_div.classList.add("pc_listname")
                            content_name_div.textContent = this.getListName(list)
                            this.ObjAppend(content_div, content_name_div)


                            //合约方法
                            var content_ctm_p = this.objCreate("p")
                            content_ctm_p.classList.add("pc_method")
                            content_ctm_p.textContent = this.getListParamMethods(list)
                            this.ObjAppend(content_div, content_ctm_p)

                            this.ObjAppend(listObj, content_div)

                            // cnts & state

                            var state_cnts_div = this.objCreate("div")
                            state_cnts_div.classList.add("pc_cnts")


                            //时间
                            var content_ctm_span = this.objCreate("div")
                            content_ctm_span.classList.add("pc_listdate", "listCtm") // listCtm不要随便修改，后面刷新时间(flushListCtm)用到了这个class
                            content_ctm_span.textContent = this.getListCtmMsg(list)
                            content_ctm_span.setAttribute("ctm", list.ctm)
                            this.ObjAppend(state_cnts_div, content_ctm_span)

                            var cnts = this.getListCnts(list)
                            if (cnts) {
                                this.ObjAppend(state_cnts_div, cnts);

                                var cnts_class = this.getListCntsClass(list);
                                if (cnts_class) state_cnts_div.classList.add(cnts_class)
                            }

                            var state = this.getListState(list);
                            if (state) this.ObjAppend(state_cnts_div, state)

                            this.ObjAppend(listObj, state_cnts_div)


                            this.ObjAppend(this.divLists, listObj)
                        }
                    );

                }
            }
            else {
                Main.showErrCode(res.errCode)
            }

        }

        private getSgasIcon(v): string {
            try {
                var params = JSON.parse(v.params)
                if (params.hasOwnProperty("nnc")) {
                    params = [params]
                }
                if (params instanceof Array) {
                    for (let k in params) {
                        if (params[k].hasOwnProperty('nnc')) {
                            if (params[k].nnc == tools.CoinTool.id_SGAS) {
                                return Main.resHost + "res/img/sgas.png";
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', 'getListImg, v.type=' + v.type + ', error => ', e)
            }
            return Main.resHost + "res/img/oldsgas.png";
        }

        getListImg(v) {
            if (v.state == "0" && v.type == "5") {
                // 未确认，统一返回未确认图标
                return Main.resHost + "res/img/transconfirm.png";
            }

            switch (v.type) {
                case "1": // gas->sgas
                case "2": // sgas->gas
                case "3": // sgas充值到游戏
                case "4": // game->sgas退款
                    return this.getSgasIcon(v)
                case "5": // 游戏交易
                    // 判断params里面是否有sgas合约，有的话标记成sgas图标
                    try {
                        var params = JSON.parse(v.params)
                        if (params.hasOwnProperty("nnc")) {
                            params = [params]
                        }
                        if (params instanceof Array) {
                            for (let k in params) {
                                if (params[k].hasOwnProperty('nnc')) {
                                    if (params[k].nnc == tools.CoinTool.id_SGAS) {
                                        return Main.resHost + "res/img/sgas.png";
                                    }
                                }
                            }
                            if (Number(v.cnts) > 0) {
                                return Main.resHost + "res/img/oldsgas.png";
                            }
                        }
                    }
                    catch (e) {
                        console.log("[BlaCat]", '[PayView]', 'getListImg, v.type=5, error => ', e)
                    }
                    return v.icon;
                case "6": // gas转账
                    // 显示gas图标
                    return Main.resHost + "res/img/gas.png";
                case "7": // bcp转账
                    return Main.resHost + "res/img/bcp.png";
                case "8": // bct转账
                    return Main.resHost + "res/img/bct.png";
                case "9": // 储值
                    switch (v.type_detail) {
                        case "1": // btc
                            return Main.resHost + "res/img/btc.png";
                        case "2": // eth
                            return Main.resHost + "res/img/eth.png";
                        default:
                            return Main.resHost + "res/img/game0.png";
                    }
                case "10": // 交易钱包余额扣款
                case "12": // 交易钱包余额退款
                    var res = this.parseTypeDetailType10(v.type_detail)
                    switch (res.type_src) {
                        case "1": // btc
                            return Main.resHost + "res/img/btc.png";
                        case "2": // eth
                            return Main.resHost + "res/img/eth.png";
                        default:
                            return Main.resHost + "res/img/game0.png";
                    }
                case "11": // 交易钱包余额购买结果
                    var res = this.parseTypeDetailType10(v.type_detail)
                    switch (res.type) {
                        case "1": // gas
                            return Main.resHost + "res/img/gas.png";
                        case "2": // bcp
                            return Main.resHost + "res/img/bcp.png";
                        default:
                            return Main.resHost + "res/img/game0.png";
                    }
                default:
                    // 默认
                    return Main.resHost + "res/img/game0.png";
            }
        }

        getListName(v) {
            if (v.g_id == "0") {
                return Main.platName;
            }
            else {
                // console.log("[BlaCat]", '[PayView]', 'v.name => ', v.name)
                try {
                    var nameObj = JSON.parse(v.name)
                    if (nameObj.hasOwnProperty(Main.langMgr.type)) {
                        return nameObj[Main.langMgr.type]
                    }
                    else if (nameObj.hasOwnProperty("cn")) {
                        return nameObj.cn;
                    }
                }
                catch (e) {
                    // return v.name;
                    console.log("[BlaCat]", '[PayView]', 'getListName, v', v, 'error => ', e.toString())
                }
            }
            return v.name;
        }

        getListCtm(v) {
            return Main.getDate(v.ctm)
        }

        getListCtmMsg(v) {
            var str = "";

            var timestamp = (new Date()).getTime();
            var ts = Math.round(timestamp / 1000);
            var last = ts - Number(v.ctm)

            var year = 60 * 60 * 24 * 365;
            var month = 60 * 60 * 24 * 30;
            var day = 60 * 60 * 24;
            var hour = 60 * 60;
            var minute = 60;

            if (last >= year) {
                var n = Math.floor(last / year);
                return Main.langMgr.get("paylist_ctm_year", { "year": n })
                // return n.toString() + "年前"
            }
            else if (last >= month) {
                var n = Math.floor(last / month);
                return Main.langMgr.get("paylist_ctm_month", { "month": n })
                // return n.toString() + "月前"
            }
            else if (last >= day) {
                var n = Math.floor(last / day);
                return Main.langMgr.get("paylist_ctm_day", { "day": n })
                // return n.toString() + "天前"
            }
            else if (last >= hour) {
                var n = Math.floor(last / hour);
                return Main.langMgr.get("paylist_ctm_hour", { "hour": n })
                // return n.toString() + "小时前"
            }
            else if (last >= minute) {
                var n = Math.floor(last / minute);
                return Main.langMgr.get("paylist_ctm_minute", { "minute": n })
                // return n.toString() + "分钟前"
            }
            else if (last >= 0) {
                return Main.langMgr.get("paylist_ctm_recent")
                // return "刚才"
            }
            else {
                // 负数？和服务器时间有差别，也返回刚才
                return Main.langMgr.get("paylist_ctm_recent")
                // return "刚才"
            }
        }

        getListParamMethods(v) {
            try {
                var params = JSON.parse(v.params)
                if (params.hasOwnProperty("sbPushString")) {
                    params = [params]
                }
                if (params instanceof Array) {
                    var method = new Array();
                    for (let k in params) {
                        if (params[k].hasOwnProperty("sbPushString")) {
                            method.push(params[k].sbPushString)
                        }
                    }
                    if (method.length > 1) {
                        return method[0] + ', ...';
                    }
                    else {
                        return method.toString()
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', 'getListParamMethods, v', v, 'error => ', e.toString())
            }
            return Main.langMgr.get("paylist_sbPushString_none")
        }

        getListCnts(v) {
            if (v.cnts && Number(v.cnts) != 0) {
                var state_cnts_span = this.objCreate("span")
                state_cnts_span.textContent = v.cnts
                return state_cnts_span;
            }
        }

        getListCntsClass(v) {
            if (v.type == "1" || (v.type == "5" && v.type_detail == "2") || v.type == "9" || v.type == "11") {
                return 'pc_income';
            }
            else if (Number(v.cnts) > 0) {
                return 'pc_expenditure';
            }
            return "";
        }

        getListState(v) {
            var state = v.state;
            var pct = "50%"; // 只有state=0才生效
            var i = 1; // 只有state=0生效，=1转圈；=2感叹号

            switch (v.type) {
                case "2": // sgas->gas平台退款
                    pct = "25%"
                    // 退款请求，特殊处理
                    if (v.state == "1") {
                        state = '0';
                        pct = '50%'

                        if (v.ext != "") {
                            state = '0';
                            pct = "75%"
                            if (v.client_notify == "1") {
                                state = '1';
                            }
                        }
                        else {
                            // 判断是否开启钱包，钱包未开启，需要感叹号表示
                            if (!Main.isWalletOpen()) {
                                i = 2;
                            }
                        }
                    }
                    break;
                case "9": // 交易钱包余额储值
                    if (v.state == "0") {
                        try {
                            var ext = JSON.parse(v.ext)
                            if (ext.hasOwnProperty("process")) {
                                pct = ext.process + "%";
                            }
                        }
                        catch (e) {

                        }
                    }
                    break;
            }

            switch (state) {
                case '0':
                    var state_button0 = this.objCreate("div")
                    state_button0.classList.add("pc_verification")
                    if (i == 1) {
                        state_button0.classList.add("iconfont", "icon-bc-dengdai")
                        state_button0.innerHTML = "<label>" + pct + "</label>"
                    } else {
                        // 感叹号
                        var obja = this.objCreate("a")
                        obja.classList.add("iconfont", "icon-bc-jinhangzhong")
                        obja.innerHTML = '<label>' + pct + '</label>';
                        obja.onclick = () => {
                            Main.continueRefund()
                            event.stopPropagation();
                        }
                        this.ObjAppend(state_button0, obja);
                    }

                    return state_button0;
                case '1':
                    var state_a1 = this.objCreate("a")
                    state_a1.classList.add("iconfont", "icon-bc-gou")
                    return state_a1;
                case '2':
                    var state_a2 = this.objCreate("a")
                    state_a2.classList.add("iconfont", "icon-bc-chacha")
                    return state_a2;
            }
        }

        getListBlockindex(v) {
            if (v.hasOwnProperty('blockindex')) {
                return v["blockindex"]
            }
            return 0
        }

        private wallet_detail() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开详情页
                PayWalletDetailView.refer = "PayView"
                Main.viewMgr.change("PayWalletDetailView")
                this.hidden()

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.wallet_detail()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        // gas -> sgas
        private async makeMintTokenTransaction() {
            Main.viewMgr.change("ViewLoading")

            var mintCount = Main.viewMgr.viewTransCount.inputCount.value;
            var net_fee = Main.viewMgr.viewTransCount.net_fee;// 手续费
            console.log("[BlaCat]", '[PayView]', '充值sgas，数量 => ', mintCount, '手续费netfee =>', net_fee)


            var login = tools.LoginInfo.getCurrentLogin();

            try {
                var utxos_assets = await tools.CoinTool.getassets();
                console.log("[BlaCat]", '[PayView]', 'utxos_assets => ', utxos_assets)

                var scriptaddress = tools.CoinTool.id_SGAS.hexToBytes().reverse();
                var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                var makeTranRes: Result = tools.CoinTool.makeTran(
                    utxos_assets,
                    nepAddress,
                    tools.CoinTool.id_GAS,
                    Neo.Fixed8.fromNumber(Number(mintCount)),
                    Neo.Fixed8.fromNumber(Number(net_fee)),
                    0,
                    true, // 拆分gas的utxo，以便后续手续费
                );
            }
            catch (e) {
                Main.viewMgr.viewLoading.remove()
                let errmsg = Main.langMgr.get(e.message);
                if (errmsg) {
                    Main.showErrMsg((e.message)); // "GAS余额不足"
                }
                else {
                    Main.showErrMsg(("pay_makeMintGasNotEnough"))
                }

                return;
            }

            // gas转cgas，如果inputs+outputs的数量>=60，会超GAS,需要提示用户自己给自己转账后再操作
            var inputs_counts: number = makeTranRes.info.tran.hasOwnProperty("inputs") ? makeTranRes.info.tran.inputs.length : 0;
            var outputs_counts: number = makeTranRes.info.tran.hasOwnProperty("outputs") ? makeTranRes.info.tran.outputs.length : 0;
            var utxo_counts = inputs_counts + outputs_counts
            if (utxo_counts >= 50) {
                Main.viewMgr.viewLoading.remove()
                Main.showErrMsg("pay_makeMintGasUtxoCountsLimit", () => {
                    PayTransferView.callback = null
                    PayTransferView.address = Main.user.info.wallet
                    Main.viewMgr.change("PayTransferView")
                    Main.viewMgr.payTransferView.inputGasCount.value = mintCount
                }, { gas: mintCount })
                return
            }


            var sb = new ThinNeo.ScriptBuilder();
            //Parameter inversion
            sb.EmitParamJson([]); //Parameter list
            sb.EmitPushString("mintTokens"); //Method
            sb.EmitAppCall(scriptaddress); //Asset contract

            var tran: any = makeTranRes.info.tran;
            var oldarr = makeTranRes.info.oldarr;

            tran.type = ThinNeo.TransactionType.InvocationTransaction;
            tran.extdata = new ThinNeo.InvokeTransData();
            tran.extdata.script = sb.ToArray();
            tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
            // if (Number(extgas) > 0) {
            //     // 添加了手续费，version = 1
            //     tran.version = 1;
            // }

            var msg = tran.GetMessage();
            var signdata = ThinNeo.Helper.Sign(msg, login.prikey);
            tran.AddWitness(signdata, login.pubkey, login.address);

            var txid = tran.GetHash().clone().reverse().toHexString();

            var data = tran.GetRawData();
            var r = await tools.WWW.api_postRawTransaction(data);
            if (r) {
                if (r["txid"] || r["sendrawtransactionresult"]) {
                    if (!r["txid"] || r["txid"] == "") {
                        r["txid"] = txid
                    }
                    // 成功，上报
                    var logRes = await ApiTool.addUserWalletLogs(
                        Main.user.info.uid,
                        Main.user.info.token,
                        r["txid"],
                        "0",
                        mintCount,
                        "1",
                        '{"sbParamJson":"[]", "sbPushString": "mintTokens", "nnc": "' + tools.CoinTool.id_SGAS + '"}',
                        Main.netMgr.type,
                        "0",
                        net_fee
                    );
                    // if (logRes.r)
                    // {
                    //     Main.platWalletLogId = parseInt(logRes.data);
                    // }

                    // 记录使用的utxo，后面不再使用，需要记录高度
                    var height = await tools.WWW.api_getHeight_nodes();
                    oldarr.map(old => old.height = height);
                    tools.OldUTXO.oldutxosPush(oldarr);

                    // 重新获取记录
                    Main.viewMgr.viewLoading.remove()
                    this.doGetWalletLists(1);

                    // TODO: 更新记录状态
                    //this.makeMintTokenTransaction_confirm(txid);
                } else {
                    // 失败
                    Main.viewMgr.viewLoading.remove()
                    // Main.showErrMsg(
                    //     "充值[" +
                    //     mintCount +
                    //     "]sgas失败！" +
                    //     "\r\n充值合约执行失败！\r\n" +
                    //     "请等待上次充值确认后再操作！"
                    // );
                    Main.showErrMsg("pay_makeMintDoFail")
                }
            } else {
                // 失败
                Main.viewMgr.viewLoading.remove()
                // Main.showErrMsg(
                //     "充值[" +
                //     mintCount +
                //     "]sgas失败！" +
                //     "\r\n发送充值请求失败！请检查网络，稍候重试！"
                // );
                Main.showErrMsg("pay_makeMintDoFail2")
            }
        }

        // sgas -> gas
        private async makeRefundTransaction(id_SGAS: string = tools.CoinTool.id_SGAS) {
            Main.viewMgr.change("ViewLoading")

            var refundCount = Main.viewMgr.viewTransCount.inputCount.value;
            var sendCount = Neo.Fixed8.fromNumber(Number(refundCount))

            var net_fee = Main.viewMgr.viewTransCount.net_fee;// 手续费
            // var net_fee = "0.00000001"
            console.log("[BlaCat]", '[PayView]', '退到gas，数量 => ', refundCount, '手续费netfee =>', net_fee)

            // 查询SGAS余额
            var scriptaddress = id_SGAS.hexToBytes().reverse();

            var login = tools.LoginInfo.getCurrentLogin();

            //获取sgas合约地址的资产列表
            if (id_SGAS == '0x74f2dc36a68fdc4682034178eb2220729231db76') {
                // 注意，如果合约升级了，需要改动
                // 协调退款
                var utxos_assets = await tools.CoinTool.getCgasAssets(id_SGAS, Number(refundCount));
            }
            else {
                var utxos_assets = await tools.CoinTool.getsgasAssets(id_SGAS);
            }


            var us = utxos_assets[tools.CoinTool.id_GAS];
            if (us == undefined) {
                Main.viewMgr.viewLoading.remove()
                // Main.showErrMsg("Sgas余额不足");
                Main.showErrMsg("pay_makeRefundSgasNotEnoughUtxo")
                return;
            }

            // 打乱us顺序，尽量避免一个块时间内，使用了重复的utxo，导致交易失败
            // 不能完全避免失败，但是可以提高并发成功率
            let us_random = []
            Main.randomSort(us, us_random)
            us = us_random

            console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, us.before => ', us);

            //检查sgas地址拥有的gas的utxo是否有被标记过
            var us_parse = [] // us处理后结果
            var count: Neo.Fixed8 = Neo.Fixed8.Zero;
            for (var i = us.length - 1; i >= 0; i--) {

                if (count.compareTo(sendCount) > 0) {
                    // 足够数量了，后面的直接剔除了
                    console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, enough us[' + i + '].delete => ', us[i]);
                    // delete us[i];
                    continue
                }

                if (us[i].n > 0) {
                    count = count.add(us[i].count)
                    us_parse.push(us[i])
                    continue;
                }

                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitParamJson(["(hex256)" + us[i].txid.toString()]);
                sb.EmitPushString("getRefundTarget");
                sb.EmitAppCall(scriptaddress);

                var data = sb.ToArray();
                var r = await tools.WWW.rpc_getInvokescript(data);
                if (r) {
                    var stack = r["stack"];
                    var value = stack[0]["value"].toString();
                    if (value.length > 0) {
                        console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, us[' + i + '].delete => ', us[i]);
                        // delete us[i];
                    }
                    else {
                        count = count.add(us[i].count)
                        us_parse.push(us[i])
                    }
                }
            }
            us = us_parse

            console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, us.after => ', us);

            utxos_assets[tools.CoinTool.id_GAS] = us;

            console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, utxos_assets.after => ', utxos_assets);

            // 生成交易请求

            //sgas 自己给自己转账   用来生成一个utxo  合约会把这个utxo标记给发起的地址使用
            try {
                var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                var makeTranRes: Result = tools.CoinTool.makeTran(
                    utxos_assets,
                    nepAddress,
                    tools.CoinTool.id_GAS,
                    Neo.Fixed8.fromNumber(Number(refundCount))
                );
                // 有网络手续费
                if (Number(net_fee) > 0) {

                    // makeTranRes.info.tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                    try {
                        // 获取用户utxo
                        var user_utxos_assets = await tools.CoinTool.getassets();
                        console.log("[BlaCat]", '[PayView]', 'makeRefundTransaction, user_utxos_assets => ', user_utxos_assets)

                        var user_makeTranRes: Result = tools.CoinTool.makeTran(
                            user_utxos_assets,
                            Main.user.info.wallet,
                            tools.CoinTool.id_GAS,
                            Neo.Fixed8.Zero,
                            Neo.Fixed8.fromNumber(Number(net_fee)),
                        );

                        // inputs、outputs、oldarr塞入
                        var user_tran = user_makeTranRes.info.tran
                        for (let i = 0; i < user_tran.inputs.length; i++) {
                            makeTranRes.info.tran.inputs.push(user_tran.inputs[i])
                        }
                        for (let i = 0; i < user_tran.outputs.length; i++) {
                            makeTranRes.info.tran.outputs.push(user_tran.outputs[i])
                        }
                        var user_oldarr = user_makeTranRes.info.oldarr
                        for (let i = 0; i < user_oldarr.length; i++) {
                            makeTranRes.info.oldarr.push(user_oldarr[i])
                        }
                        console.log("[BlaCat]", '[PayView]', 'makeRefundTransaction, user_makeTranRes => ', user_makeTranRes)
                    }
                    catch (e) {
                        Main.viewMgr.viewLoading.remove()
                        let errmsg = Main.langMgr.get(e.message);
                        if (errmsg) {
                            Main.showErrMsg((e.message)); // "GAS余额不足"
                        }
                        else {
                            Main.showErrMsg(("pay_makeMintGasNotEnough"))
                        }

                        return;
                    }
                }
            }
            catch (e) {
                Main.viewMgr.viewLoading.remove()
                // Main.showErrMsg("SGAS余额不足");
                Main.showErrMsg("pay_makeRefundSgasNotEnough")
                return;
            }

            console.log(
                "[BlaCat]", "[payView]", "makeRefundTransaction, makeTranRes => ",
                makeTranRes
            );

            var r = await tools.WWW.api_getcontractstate(id_SGAS);
            if (r && r["script"]) {
                var sgasScript = r["script"].hexToBytes();

                var scriptHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(
                    login.address
                );

                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitParamJson(["(bytes)" + scriptHash.toHexString()]);
                sb.EmitPushString("refund");
                sb.EmitAppCall(scriptaddress);

                var tran: any = makeTranRes.info.tran;
                var oldarr: Array<tools.OldUTXO> = makeTranRes.info.oldarr;

                tran.type = ThinNeo.TransactionType.InvocationTransaction;
                tran.extdata = new ThinNeo.InvokeTransData();
                tran.extdata.script = sb.ToArray();
                // 网络手续费
                if (Number(net_fee) > 0) tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));

                //附加鉴证
                tran.attributes = new Array<ThinNeo.Attribute>(1);
                tran.attributes[0] = new ThinNeo.Attribute();
                tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                tran.attributes[0].data = scriptHash;

                var wsb = new ThinNeo.ScriptBuilder();
                wsb.EmitPushString("whatever");
                wsb.EmitPushNumber(new Neo.BigInteger(250));
                tran.AddWitnessScript(sgasScript, wsb.ToArray());

                //做提款人的签名
                var signdata = ThinNeo.Helper.Sign(tran.GetMessage(), login.prikey);
                tran.AddWitness(signdata, login.pubkey, login.address);

                var txid = tran.GetHash().clone().reverse().toHexString();

                var trandata = tran.GetRawData();

                console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, tran => ', tran);

                // 发送交易请求

                r = await tools.WWW.api_postRawTransaction(trandata);

                if (r) {
                    if (r.txid || r['sendrawtransactionresult']) {
                        if (!r["txid"] || r["txid"] == "") {
                            r["txid"] = txid
                        }
                        var paramJson_tmp = "(bytes)" + scriptHash.toHexString();
                        // 上报钱包操作记录
                        var logRes = await ApiTool.addUserWalletLogs(
                            Main.user.info.uid,
                            Main.user.info.token,
                            r.txid,
                            "0",
                            refundCount,
                            "2",
                            // 塞入net_fee，以便退款第二步参考手续费
                            '{"sbParamJson":"' + paramJson_tmp + '", "sbPushString": "refund", "nnc": "' + id_SGAS + '", "net_fee": "' + net_fee + '"}',
                            Main.netMgr.type
                        );
                        if (logRes.r) {
                            Main.platWalletLogId = parseInt(logRes.data);
                        }

                        // 记录使用的utxo，后面不再使用，需要记录高度
                        var height = await tools.WWW.api_getHeight_nodes();
                        oldarr.map(old => old.height = height);
                        tools.OldUTXO.oldutxosPush(oldarr);

                        // 等待交易确认
                        // this.makeRefundTransaction_confirm(r["txid"], refundCount);

                        // 刷新钱包记录，显示当前交易信息
                        Main.viewMgr.viewLoading.remove()
                        this.doGetWalletLists(1)

                    } else {
                        Main.viewMgr.viewLoading.remove()
                        // Main.showErrMsg("提取合约执行失败！请等待上个提现或兑换交易完成再操作！");
                        Main.showErrMsg(("pay_makeRefundDoFail"))
                    }
                    console.log("[BlaCat]", '[payView]', 'makeRefundTransaction, api_postRawTransaction结果 => ', r);

                }
                else {
                    Main.viewMgr.viewLoading.remove()
                    // Main.showErrMsg("发送提取交易失败！请检查网络，稍候重试！");
                    Main.showErrMsg("pay_makeRefundDoFail2")
                }
            }
            else {
                Main.viewMgr.viewLoading.remove()
                // Main.showErrMsg("获取提取合约失败！");
                Main.showErrMsg("pay_makeRefundGetScriptFail")
            }
        }

        //收款
        private async doMakeReceivables() {
            this.hidden()
            PayReceivablesView.refer = "PayView"
            Main.viewMgr.change("PayReceivablesView")
        }


        //转账
        private async doMakeTransfer() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开转账页
                PayTransferView.refer = "PayView"
                PayTransferView.callback = () => {
                    this.doGetWalletLists(1)
                }
                Main.viewMgr.change("PayTransferView")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doMakeTransfer()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }
        private changetokenlist(type: string) {
            switch (type) {
                case "blacat":
                    this.divCurrencyBlaCatlist.style.display = "block"
                    this.divCurrencyNEOlist.style.display = "none"
                    this.divCurrencyotherlist.style.display = "none"
                    this.token_blacat.classList.add("active")
                    this.token_neo.classList.remove("active")
                    this.token_other.classList.remove("active")
                    break;
                case "neo":
                    this.divCurrencyBlaCatlist.style.display = "none"
                    this.divCurrencyNEOlist.style.display = "block"
                    this.divCurrencyotherlist.style.display = "none"
                    this.token_blacat.classList.remove("active")
                    this.token_neo.classList.add("active")
                    this.token_other.classList.remove("active")
                    break;
                case "other":
                    this.divCurrencyBlaCatlist.style.display = "none"
                    this.divCurrencyNEOlist.style.display = "none"
                    this.divCurrencyotherlist.style.display = "block"
                    this.token_blacat.classList.remove("active")
                    this.token_neo.classList.remove("active")
                    this.token_other.classList.add("active")
                    break;

            }
        }

        flushListCtm() {
            var ctms = document.getElementsByClassName("listCtm")
            if (ctms && ctms.length > 0) {
                for (let k = 0; k < ctms.length; k++) {
                    var list = {
                        ctm: ctms[k].getAttribute("ctm")
                    }
                    ctms[k].textContent = this.getListCtmMsg(list)
                }
            }
        }

        private getNetTypeName() {
            return Main.langMgr.get("pay_nettype_" + Main.netMgr.type);
        }

        private showChangeNetType() {
            if (this.divNetSelect.innerHTML.length > 0) {
                this.divNetSelect.innerHTML = "";
            }
            else {
                var other = Main.netMgr.getOtherTypes()
                for (let i = 0; i < other.length; i++) {
                    this.ObjAppend(this.divNetSelect, this.getDivNetSelectType(other[i]))
                }
            }
        }

        private getDivNetSelectType(type: number) {
            var divObj = this.objCreate("div")
            divObj.textContent = Main.langMgr.get("pay_nettype_" + type)
            divObj.onclick = () => {
                Main.changeNetType(type)
            }
            return divObj;
        }

        checkTransCount(count: string): boolean {
            var regex = /(?!^0*(\.0{1,2})?$)^\d{1,14}(\.\d{1,8})?$/
            if (!regex.test(count)) {
                return false
            }
            if (Number(count) <= 0) {
                return false
            }
            return true
        }

        async getHeight(type: string) {
            var height = await tools.WWW["api_getHeight_" + type]()
            this.updateHeight(type, height)
        }
        updateHeight(type, height) {
            this["divHeight_" + type].textContent = height.toString()
            this["height_" + type] = height
        }

        parseTypeDetailType10(type_detail: string) {
            var res = { type: "0", type_src: "0" }
            var detail = parseInt(type_detail)
            res.type_src = Math.floor(detail / 1000).toString()
            res.type = (detail % 1000).toString()

            return res
        }
    }
}