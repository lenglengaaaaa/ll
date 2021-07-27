import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    modules[moduleName] = modulesFiles(modulePath).default || modulesFiles(modulePath);
    return modules
}, {})

const store = new Vuex.Store({
    modules,
    plugins: [
        new createPersistedState ({
            paths: [
                // 'app',
                'overall',
                'equip',
                'user'
            ],
            storage: window.sessionStorage,
            //只持续化某一项
            // reducer(val){
            //     return{
            //         device:val.app.device
            //     }
            // }
        })
    ]
})

export default store
