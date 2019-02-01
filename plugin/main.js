let websocket = null;
let pluginUUID = null;
let settingsCache = {};

const controlAction = {

    type : "com.baptiewright.nanoleaf.control",

    onKeyUp : function(context, settings, coordinates, userDesiredState) {
        var ip = "";
        var auth = "";
        var control = "";
        var controlvalue = "";
        if(settings['ip'] != null){
             ip = settings["ip"];
        }
        
        if(settings['auth'] != null){
             auth = settings["auth"];
        }
        
        if(settings['control'] != null){
            control = settings["control"];
        }
        if(settings['controlvalue'] != null){
           controlvalue = settings["controlvalue"];
        }
        if (ip && auth && control){
            setNanoleafControl(ip,auth,control,controlvalue,context);
        }
    },

    onWillAppear : function(context, settings, coordinates) {
        settingsCache[context] = settings;
    },

    SetSettings : function(context, settings) {
        const json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
    },

    SendSettings : function(action, context) {
        const json = {
            "action": action,
            "event": "sendToPropertyInspector",
            "context": context,
            "payload": settingsCache[context]
        };
        websocket.send(JSON.stringify(json));
    },

    SetTitle : function(context,jsonPayload) {
        //console.log(jsonPayload['title']);
        let payload = {};
        payload.title = jsonPayload['title'];
        payload.target = "DestinationEnum.HARDWARE_AND_SOFTWARE";
        const json = {
            "event": "setTitle",
            "context": context,
            "payload": payload,
        };
        websocket.send(JSON.stringify(json));
    }

};

const effectsAction = {

    type : "com.baptiewright.nanoleaf.effects",

    onKeyUp : function(context, settings, coordinates, userDesiredState) {
        var ip = "";
        var auth = "";
        var effect = "";

        if(settings['ip'] != null){
             ip = settings["ip"];
        }
        
        if(settings['auth'] != null){
             auth = settings["auth"];
        }
        
        if(settings['effect'] != null){
            effect = settings["effect"];
       }

        if (ip && auth && effect){
            setNanoleafEffect(ip,auth,effect,context);
        }
        
    },

    onWillAppear : function(context, settings, coordinates) {
        settingsCache[context] = settings;
    },

    SetSettings : function(context, settings) {
        const json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
    },

    SendSettings : function(action, context) {
        const json = {
            "action": action,
            "event": "sendToPropertyInspector",
            "context": context,
            "payload": settingsCache[context]
        };

        websocket.send(JSON.stringify(json));
    },

    SetTitle : function(context,jsonPayload) {
        //console.log(jsonPayload['title']);
        let payload = {};
        payload.title = jsonPayload['title'];
        payload.target = "DestinationEnum.HARDWARE_AND_SOFTWARE";
        const json = {
            "event": "setTitle",
            "context": context,
            "payload": payload,
        };
        websocket.send(JSON.stringify(json));
    }

};


function setNanoleafEffect(ip,auth,effect,context)
{
    var leafURL = "http://"+ip+":16021/api/v1/";
    var leafAuth = auth;
    var method = "put";
    if(ip != "undefined" && auth != "undefined" && effect){
        if (effect == "On")
        {
            var leafParams = "/state";
            var effectData = {"on":true};
            var shouldBeAsync = true;
        } 
    else if (effect == "Off")
        {
            var leafParams = "/state";
            var method = "put";
            var effectData = {"on":false};
            var shouldBeAsync = true;
        }
        else {
        var leafParams = "/effects/select";
        var method = "put";
        var effectData = {"select":effect};
        var shouldBeAsync = true;
        }
        var request = new XMLHttpRequest();
        //console.log(request);
        request.open(method, leafURL+leafAuth+leafParams, shouldBeAsync);
        request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"); 
        console.log(request);
        request.send(JSON.stringify(effectData));
        request.onreadystatechange = function() {
            if (request.readyState == 4){
                if (request.status == 204) {
                    //var status = request.status;
                    //var data = JSON.parse(request.responseText);
                    //console.log("effect changed");
                    showAlert("showOk",context);                }
                else {
                    //console.log("Shit went wrong");
                    showAlert("showAlert",context);
                }
            }
        }
    
    }
}

function setNanoleafControl(ip,auth,control,controlValue,context)
{
    var leafURL = "http://"+ip+":16021/api/v1/";
    var leafAuth = auth;
    var method = "put";
    var controlData = null;
    var subData = null;
    if(ip != "undefined" && auth != "undefined" && control){
        var leafParams = "/state";
        var shouldBeAsync = true;
        switch (control){
            case "On" :
                controlData = {"on":true};
            break;
            case "Off" :
                controlData = {"on":false};
            break;
            case "Brightness -" :
                subData = {"increment":parseInt((controlValue - (controlValue * 2)))};
                controlData = {"brightness":subData};
            break;
            case "Brightness +" :
                subData = {"increment":parseInt(controlValue)};
                controlData = {"brightness":subData};
            break;
            case "Brightness" :
                subData = {"value":parseInt(controlValue)};
                controlData = {"brightness":subData};
            break;
        }
        console.log(controlData);
        var request = new XMLHttpRequest();
        //console.log(request);
        request.open(method, leafURL+leafAuth+leafParams, shouldBeAsync);
        request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"); 
        //console.log(request);
        request.send(JSON.stringify(controlData));
        request.onreadystatechange = function() {
            if (request.readyState == 4){
                if (request.status == 204) {
                    //var status = request.status;
                    //var data = JSON.parse(request.responseText);
                    //console.log("effect changed");
                    showAlert("showOk",context);                }
                else {
                    //console.log("Shit went wrong");
                    showAlert("showAlert",context);
                }
            }
        }
    
    }
}

function showAlert(event,context) {
    if (websocket) {
        let payload = {};
        const json = {
            "event": event,
            "context": context,
        };
        websocket.send(JSON.stringify(json));
    }
}

function connectSocket(inPort, inPluginUUID, inRegisterEvent, inInfo)
{
    pluginUUID = inPluginUUID;

    // Open the web socket
    websocket = new WebSocket("ws://localhost:" + inPort);

    function registerPlugin(inPluginUUID)
    {
        const json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };

        websocket.send(JSON.stringify(json));
    };

    websocket.onopen = function()
    {
        // WebSocket is connected, send message
        registerPlugin(pluginUUID);
    };

    websocket.onmessage = function (evt)
    {
        // Received message from Stream Deck
        const jsonObj = JSON.parse(evt.data);
        const event = jsonObj['event'];
        const action = jsonObj['action'];
        const context = jsonObj['context'];
        const jsonPayload = jsonObj['payload'];

        if(event == "keyUp")
        {
            const settings = jsonPayload['settings'];
            const coordinates = jsonPayload['coordinates'];
            const userDesiredState = jsonPayload['userDesiredState'];
            switch (action) {
                case "com.baptiewright.nanoleaf.control" :
                    controlAction.onKeyUp(context, settings, coordinates, userDesiredState);
                break;
                case "com.baptiewright.nanoleaf.effects" :
                    effectsAction.onKeyUp(context, settings, coordinates, userDesiredState);
                break;
            }
        }
        else if(event == "willAppear")
        {
            const settings = jsonPayload['settings'];
            const coordinates = jsonPayload['coordinates'];
            switch (action) {
                case "com.baptiewright.nanoleaf.control" :
                    controlAction.onWillAppear(context, settings, coordinates);
                break;
                case "com.baptiewright.nanoleaf.effects" :
                    effectsAction.onWillAppear(context, settings, coordinates);
                break;
            }
        }
        else if(event == "sendToPlugin") {

            if(jsonPayload['type'] == "updateSettings") {
                switch (action) {
                    case "com.baptiewright.nanoleaf.control" :
                        controlAction.SetSettings(context, jsonPayload);
                    break;
                    case "com.baptiewright.nanoleaf.effects" :
                        effectsAction.SetSettings(context, jsonPayload);
                    break;
                }
                settingsCache[context] = jsonPayload;

            } else if(jsonPayload['type'] == "requestSettings") {
                switch (action) {
                    case "com.baptiewright.nanoleaf.control" :
                        controlAction.SendSettings(action, context);
                    break;
                    case "com.baptiewright.nanoleaf.effects" :
                        effectsAction.SendSettings(action, context);
                    break;
                }
            } else if (jsonPayload['type'] == "setTitle") {
                //console.log("setTitle");
                switch (action) {
                    case "com.baptiewright.nanoleaf.control" :
                        controlAction.SetTitle(context,jsonPayload);
                    break;
                    case "com.baptiewright.nanoleaf.effects" :
                        effectsAction.SetTitle(context,jsonPayload);
                    break;
                }
            }

        }
    };
};