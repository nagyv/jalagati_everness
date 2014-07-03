/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var PUSH_SENDER_ID = "";

var pushNotification;

var pushHandler = {
    successHandler: function(result) {
        alert('result = ' + result);
    },
    errorHandler: function(error) {
        alert('error = ' + error);
    },
    tokenHandler: function(result) {
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
        alert('device token = ' + result);
    },
    // iOS
    onNotificationAPN: function (event) {
        if ( event.alert )
        {
            navigator.notification.alert(event.alert);
        }

        if ( event.sound )
        {
            var snd = new Media(event.sound);
            snd.play();
        }

        if ( event.badge )
        {
            pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
        }
    },

    // Android
    onNotificationGCM: function (e) {
        $("#debug-messages").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

        switch( e.event )
        {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regid);
            }
        break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if ( e.foreground )
            {
                $("#debug-messages").append('<li>--INLINE NOTIFICATION--' + '</li>');

                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/"+e.soundname);
                my_media.play();
            }
            else
            {  // otherwise we were launched because the user touched a notification in the notification tray.
                if ( e.coldstart )
                {
                    $("#debug-messages").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                }
                else
                {
                    $("#debug-messages").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }

            $("#debug-messages").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            $("#debug-messages").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
        break;

        case 'error':
            $("#debug-messages").append('<li>ERROR -> MSG:' + e.msg + '</li>');
        break;

        default:
            $("#debug-messages").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
        break;
      }
    }

};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        // push notification setup
        pushNotification = window.plugins.pushNotification;
        if ( device.platform == 'android' || device.platform == 'Android' ) {
            pushNotification.register(
                pushHandler.successHandler,
                pushHandler.errorHandler, {
                    "senderID":PUSH_SENDER_ID,
                    "ecb":"pushHandler.onNotificationGCM"
                });
        }
        else {
         /*
            pushNotification.register(
                pushHandler.tokenHandler,
                pushHandler.errorHandler, {
                    "badge":"true",
                    "sound":"true",
                    "alert":"true",
                    "ecb":"pushHandler.onNotificationAPN"
                });
          */
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(eventName) {
    },
    debug: function() {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", $('#debug'), { role: "dialog" } );
    }
};

$(function(){
    if(getParameterByName("debug")) {
        $('.doDebug').show();
    }
});
