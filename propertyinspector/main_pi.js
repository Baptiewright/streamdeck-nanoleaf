let websocket = null,
    uuid = null,
    actionInfo = {};

function connectSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
    uuid = inUUID;

    actionInfo = JSON.parse(inActionInfo);
    //console.log(actionInfo);
    websocket = new WebSocket('ws://localhost:' + inPort);

    websocket.onopen = function () {
        const json = {
            event:  inRegisterEvent,
            uuid:   inUUID
        };
        websocket.send(JSON.stringify(json));
        requestSettings();
    };

    websocket.onmessage = function (evt) {
        // Received message from Stream Deck
        const jsonObj = JSON.parse(evt.data);
        const action = jsonObj.action;
        if (jsonObj.event === 'sendToPropertyInspector') {
            const payload = jsonObj.payload;
            if (payload.error) {
                return;
            }
            const ip = document.getElementById('ip');
            ip.value = payload.ip;

            const auth = document.getElementById('auth');
            auth.value = payload.auth;
            
            const pair = document.getElementById('pair');

            if(ip.value == "undefined") {
                ip.value = "";
            }

            if (auth.value == "undefined" || auth.value == "Start Nanoleaf Pairing Then Hit --->"){
                auth.value = "";
            }
        
            if (ip.value != "" && auth.value == "")
            {
                pair.hidden = false;
            }
            else
            {
                pair.hidden = true;
            }
            switch (action) {
                case "com.baptiewright.nanoleaf.control" :
                    controlPanel(action);
                    const control = document.getElementById('control');
                    const controlvalue = document.getElementById('controlvalue');
                    const valuelabel = document.getElementById('valuelabel');
                    savedControl = payload.control;
                    savedValue = payload.controlvalue;
                    if (savedValue){
                        controlvalue.value = savedValue;
                    }
                    if (!savedControl)
                    {
                        savedControl = "On";
                    }
                    var controls = ["On","Off","Brightness -","Brightness +", "Brightness"];
                    for (index in controls){
                        control.options[control.options.length] = new Option(controls[index],controls[index]);
                        if (savedControl == controls[index])
                        {
                            control.options[index].selected = true;
                        }
                    }
                    if (savedControl == "On" || savedControl == "Off"){
                        controlvalue.style = "visibility: hidden";
                        valuelabel.hidden = true;
                        console.log("hide");
                    }
                    else {
                        controlvalue.style = "visibility: visible";
                        valuelabel.hidden = false;
                        console.log("show");
                    }

                break;
                case "com.baptiewright.nanoleaf.effects" :
                    effectsPanel(action);
                    const effects = document.getElementById('effects');
                    savedEffects = payload.effects;
                    //console.log(savedEffects);
                    //console.log(savedEffects.length);
                    effect = payload.effect;
                    if (savedEffects != "undefined")
                    {
                        for (index in savedEffects){
                            effects.options[effects.options.length] = new Option(savedEffects[index],savedEffects[index]);
                            if (effect == savedEffects[index])
                            {
                                effects.options[index].selected = true;
                            }
                        }
                    }
                    
                break;
            }
            
            const el = document.querySelector('.sdpi-wrapper');
            el && el.classList.remove('hidden');
        }
    };

}

function valueLimit(element)
{
    var max_chars = 3;
    if(element.value.length > max_chars) {
        element.value = element.value.substr(0, max_chars);
    }

    if (element.value > 100)
    {
        element.value = 100;
    }   
}

function effectsPanel(action)
{
    console.log(action);
    panel = document.getElementById('panel');
    panel.innerHTML = '        <div class="sdpi-item"> \
    <div class="sdpi-item-label">Effects</div> \
    <select class="sdpi-item-value select" id="effects" onchange="updateSettings(\''+action+'\')"> \
    </select> \
    <input value="Refresh" id="refresh" type="button" onClick="getNanoleafEffects();"> \
    </div>';
}

function controlPanel(action)
{
    console.log(action);
    panel = document.getElementById('panel');
    panel.innerHTML = '        <div class="sdpi-item"> \
    <div class="sdpi-item-label">Controls</div> \
    <select class="sdpi-item-value select" id="control" onchange="updateSettings(\''+action+'\')"> \
    </select> \
    <div class="sdpi-item-label" id="valuelabel">Value</div> \
    <input value="10" type="number" id="controlvalue" onkeydown="valueLimit(this)" onkeyup="valueLimit(this)" onChange="updateSettings(\''+action+'\')"> \
    </div>';
}

function requestSettings() {
    if (websocket) {
        let payload = {};
        payload.type = "requestSettings";
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPlugin",
            "context": uuid,
            "payload": payload,
        };
        websocket.send(JSON.stringify(json));
    }
}

function setTitle(newTitle) {
    if (websocket) {
        let payload = {};
        payload.type = "setTitle";
        payload.title = newTitle;
        payload.target = "DestinationEnum.HARDWARE_AND_SOFTWARE";
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPlugin",
            "context": uuid,
            "payload": payload,
        };
        //console.log(json);
        websocket.send(JSON.stringify(json));
    }
}

function updateSettings(action) {
    if (websocket) {
        let payload = {};

        payload.type = "updateSettings";

        const ip = document.getElementById('ip');
        payload.ip = ip.value;

        const auth = document.getElementById('auth');
        if (auth.value == "")
        {
            const pair = document.getElementById('pair');
            pair.hidden = false;
        }
        else
        {
            pair.hidden = true;
            payload.auth = auth.value;
        }
        switch (action) {
            case "com.baptiewright.nanoleaf.control" :
                const control = document.getElementById('control');
                const controlvalue = document.getElementById('controlvalue');
                const valuelabel = document.getElementById('valuelabel');
                payload.control = control.options[control.selectedIndex].value;
                payload.controlvalue = controlvalue.value;
                //console.log(payload);
                if (payload.control == "On" || payload.control == "Off"){
                    controlvalue.style = "visibility: hidden";
                    valuelabel.hidden = true;
                    //console.log("hide");
                }
                else {
                    controlvalue.style = "visibility: visible";
                    valuelabel.hidden = false;
                    //console.log("show");
                }
            break;
            case "com.baptiewright.nanoleaf.effects" :
                const effects = document.getElementById('effects');
                if (effects.length > 0)
                {
                payload.effect = effects.options[effects.selectedIndex].value;
                payload.effects = {};
                for (index in effects.options){
                    payload.effects[index] = effects.options[index].value;
                }
            break;
        }
        
       }

        //console.log(payload);
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPlugin",
            "context": uuid,
            "payload": payload,
        };
        websocket.send(JSON.stringify(json));
    }
}

function getNanoleafAuth()
{
    const ip = document.getElementById('ip');
    const auth = document.getElementById('auth');
    const authmsg = document.getElementById('authmsg');
    //console.log(authmsg);
    if(ip.value != "undefined"){
        var leafURL = "http://"+ip.value+":16021/api/v1/new";
        var leafAuth = "";
        //var leafParams = "/effects/effectsList"
        var method = "POST";
        var postData = "";
        var shouldBeAsync = true;
        var request = new XMLHttpRequest();
        request.timeout = 3000;
        //console.log(request);
        request.open(method, leafURL, shouldBeAsync);
        request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"); 
       
        request.send();
        request.onreadystatechange = function() {
            if (request.readyState == 4){
                //console.log(request);
                if (request.status == 200) {
                    var status = request.status;
                    var data = JSON.parse(request.responseText);
                    //console.log(data);
                    leafAuth = data.auth_token;

                    if (leafAuth != "")
                    {
                        //getNanoleafEffects();
                        auth.value = leafAuth;
                        authmsg.innerHTML = "Nanoleaf Paired Successfully!";
                        authmsg.open = true;
                        
                        updateSettings();
                        getNanoleafEffects();
                    }
                }
                else if (request.status == 0){
                    authmsg.innerHTML = "No Nanoleaf at this IP";
                    authmsg.open = true;
                }
                else {
                    authmsg.innerHTML = "Start Nanoleaf Pairing Then Hit Pair";
                    authmsg.open = true;
                }
            }
            //console.log(authmsg);
        }
        
    
    }
    else {
        authmsg.innerHTML = "No Nanoleaf at this IP";
        authmsg.open = true;
    }
}

function getNanoleafEffects()
{
    const ip = document.getElementById('ip');
    const auth = document.getElementById('auth');
    const effects = document.getElementById('effects');
    const authmsg = document.getElementById('authmsg');
    var currentEffect = "";
    if (effects.length > 0){
        currentEffect = effects.options[effects.selectedIndex].value;
    }
    if(ip.value != "undefined" && auth.value != "undefined"){
        var leafURL = "http://"+ip.value+":16021/api/v1/";
        var leafAuth = auth.value;
        var leafParams = "/effects/effectsList"
        var method = "GET";
        var postData = "";
        var shouldBeAsync = true;
        var request = new XMLHttpRequest();
        request.timeout = 3000;
        var neweffects = {};
        
        request.open(method, leafURL+leafAuth+leafParams, shouldBeAsync);
        request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"); 
        console.log(request);
        request.send();
        request.onreadystatechange = function() {
            if (request.readyState == 4){
                if (request.status == 200) {
                    var status = request.status;
                    var data = JSON.parse(request.responseText);
                    //console.log(data);
                    effects.options.length = 0;
                    neweffects = data;
                    for (index in neweffects){
                        effects.options[effects.options.length] = new Option(neweffects[index],neweffects[index]);
                        if (neweffects[index] == currentEffect)
                        {
                            effects.options[index].selected = true;
                        }
                        authmsg.innerHTML = "Effects Refreshed ("+effects.length+" found)";
                        authmsg.open = true;
                    }
                    updateSettings();
                }
                else if (request.status == 0){
                    authmsg.innerHTML = "No Nanoleaf found at this IP";
                    authmsg.open = true;
                }
                else {
                    authmsg.innerHTML = "Invalid Auth Token, Try Re-Pairing";
                    authmsg.open = true;
                    const pair = document.getElementById('pair');
                    pair.hidden = false;
                }
            }
        }
    
    }
}
