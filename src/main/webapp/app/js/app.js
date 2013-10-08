/**
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function () {
    'use strict';

    Ext.Loader.setConfig({
        enabled: true,
        disableCaching: false,
        paths: {
            'rssreader': window.ROOT_URL + 'app/js'
        }
    });

    Ext.application({
        name: 'rssreader',
        appFolder: window.ROOT_URL + 'app/js',

        requires: [
            'rssreader.i18n'
        ],

        controllers: [
            'Feeds'
        ],

        launch: function () {
            window.console.log('init application... ' + new Date());
            var me = this;
            var title = Ext.get(Ext.dom.Query.selectNode('title'));
            title.update(rssreader.i18n.get('application.name'));
            var Router = Backbone.Router.extend({
                routes: {
                    '': 'showChannel',
                    '/': 'showChannel',
                    'channel/:channel/': 'showChannel',
                    'channel/:channel': 'showChannel',
                    'channel/:channel/:item': 'showChannel',
                    'channel/:channel/:item/': 'showChannel'
                },
                showChannel: function (channel, item) {
                    var param = {
                        channel: channel,
                        channelItem: item
                    };
                    me.fireEvent('show-channel', param);
                }
            });
            me.router = new Router();
            //Starting the backbone history.
            Backbone.history.start({
                pushState: true,
                root: window.ROOT_URL // This value is set by <c:url>
            });
            Ext.create('rssreader.view.ApplicationViewport');
        }
    });
}());
