const getDefaultState = () => {
    return {
        messageUnRead: '', // 未读消息数量
        currentMessage: '' // 当前消息
    }
}
const state = getDefaultState ();

const mutations = {
    /**
     * 设置消息   websocket 推送过来的
     * @param state
     * @param data
     * @constructor
     */
    WEB_SOCKET_MSG: (state, data) => {
        state.messageUnRead = data ? JSON.parse(data).noReadTotal : 0
        state.currentMessage = data
    },
    // 设置未读消息数量
    SET_MESSAGE_UNREAD: (state, data) => {
        state.messageUnRead = data
    }
}
const actions = {
    web_socket_msg: ({commit}, msg) =>{
        commit('WEB_SOCKET_MSG', msg)
    },
    set_message_unread: ({commit}, msg) =>{
        commit('SET_MESSAGE_UNREAD', msg)
    },
}
const getters = {
    messageUnRead: (state) => state.messageUnRead,
    currentMessage: (state) => state.currentMessage
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
