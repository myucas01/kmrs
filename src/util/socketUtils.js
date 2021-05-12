import {createStore} from "@/store";
const store = createStore ();
import { Notification } from 'element-ui'

const SocketUtil = {
    timeOut: 6000,
    heatTimer: '',
    $ws: '',
    reconnectObj: '',
    reconnectSwitch: false,
    url: '',
    initWebSocket(url) {
        this.$ws = new WebSocket(url)
        this.url = url
        this.$ws.onopen = this.openWebSocket
        this.$ws.onclose = this.closeWebSocket
        this.$ws.onmessage = this.msgWebSocket
        this.$ws.onerror = this.openWebSocket
    },
    openWebSocket() {
        SocketUtil.heartMonitor()
    },
    msgWebSocket(msg) {
        // 将消息推送出去
        if(msg.data === 'pong') {
            // console.info('❤️')
            // 心跳 不予处理
        }else{
            let typeNoti
            if(JSON.parse(msg.data)['status']=='200'){
                typeNoti = 'success'
            } else {
                typeNoti = 'warning'
            }
            Notification({
                title: JSON.parse(msg.data)['title'],
                message: JSON.parse(msg.data)['msg'],
                type: typeNoti
            })
            store.commit('common/WEB_SOCKET_MSG', msg.data)
        }
        SocketUtil.resetHeartMonitor()
    },
    reconnectWebSockte() {
        let _this = this
        if(_this.reconnectSwitch) {
            return
        }
        _this.reconnectSwitch = true
        _this.reconnectObj &&  clearTimeout(_this.reconnectObj)
        _this.reconnectObj = setTimeout(function () {
            SocketUtil.initWebSocket(_this.url)
            _this.reconnectSwitch = false
        },_this.timeOut)
    },
    heartMonitor() {
        let _this = this
        _this.heatTimer = setInterval(() => {
            if (_this.$ws.readyState === 1) {
                _this.$ws.send('ping')
            } else {
                SocketUtil.reconnectWebSockte()
            }
        },_this.timeOut)
    },
    resetHeartMonitor() {
        this.heatTimer && clearInterval(this.heatTimer)
        SocketUtil.heartMonitor()
    },
    errorWebSocket(err) {
        console.info(err, 'websocket err')
        SocketUtil.reconnectWebSockte()
    },
    closeWebSocket() {
        if (this.$ws) {
            this.$ws.close()
        }
    }

}
export const SocketMethod = {
    install: Vue => {
        Vue.prototype.$setWs = SocketUtil;
    },
};
