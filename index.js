// mqtt設定
var mqtt = require('mqtt');
var opt = {
    port: 1883,
    clientId: 'CLIENT_ID',
    username: 'MQTT_USERNAME',
    password: 'MQTT_USERPWD'
};

// sql設定
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'MYSQL_HOST',
    user: 'MYSQL_ACC',
    password: 'MYSQL_PWD',
    database: 'MYSQL_DB'
});

  

// 日期取得
var sd = require('silly-datetime');

// 連接MQTT
var hostname = 'tcp://IP';
var client = mqtt.connect(hostname, opt);
client.on('connect', function () {
    console.log('已連接至MQTT：' + hostname + '\n');
    client.subscribe("YOUR_TOPIC");
});

// 接收訊息
client.on('message', function (topic, message) {
    console.log('收到 ' + topic + ' 主題，訊息：' + message.toString());
    console.log('時間 ' + sd.format(new Date, 'YYYY-MM-DD HH:mm:ss'));
    dataProcess(message);
});

//資料處理
function dataProcess(message) {

    if(message=="Ready!") {}
    else{
    var json = JSON.parse(message);
    var type=json.type;
    var working_status=json.working_status;
    var voltage=json.voltage;
    var current=json.current;

    if(type=='Zone'&&(working_status=='T'|working_status=='F')){
        var creat_at=json.creat_at;
        var mac_adder=json.esp_mac;
        
        sql = 'INSERT INTO `Sensor_Zone`(`creat_at`, `type`, `esp_mac`,`working_status`) '+'VALUES (?, ?,?,?)';
        params=[creat_at,type,mac_adder,working_status];
        conn.query(sql, params,function (err, results, fields) { 
            if (err) throw err; 
            
            console.log('Senser_Zone data Insert into Database Table Successful!');
        })
    }
    else if(type=='Treadmill'&&(voltage&&current)){
        var mac_adder=json.esp_mac;

        sql = 'INSERT INTO `Treadmill`(`creat_at`, `type`, `esp_mac`,`voltage`,`current`)' +'VALUES (?, ?,?,?,?)';
        params=[creat_at,type,mac_adder,voltage,current];
        conn.query(sql,params, function (err, results) { 
            if (err) throw err; 
            console.log('Treadmill data Insert into Database Table Successful!');
        })
    }
    else{

    }
           
    }
    

}