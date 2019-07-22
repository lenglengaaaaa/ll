import mqtt from 'mqtt'

const {mqttUrl,mqttAccount}= window.$cfg;

export default {
    connect(topic){ 
        const client = mqtt.connect(mqttUrl,mqttAccount);
        client.on("connect",()=>{
            console.log('连接MQTT服务成功!')
            client.unsubscribe(topic);
            client.subscribe(topic, function () {
                console.log("mqtt预订消息成功");
            });
        })

        client.on("reconnect", function () {
            console.log("mqtt正在尝试重新连接...");
        });

        client.on("offline", function () {
            console.log("mqtt连接出错");
            client.unsubscribe(topic);
        });

        client.on("close", function () {
            console.log("MQTT服务成功关闭!");
        });

        return client;
    },
    listen(client, cb) {
        client.on("message", function (topic, message) {
            // if (message.toString().indexOf("'AlarmId':-1") !== -1) return;
            var res = JSON.parse(message.toString().replace(/'/g, '"'));
            typeof cb === "function" && cb(res);
        });
    }
}


