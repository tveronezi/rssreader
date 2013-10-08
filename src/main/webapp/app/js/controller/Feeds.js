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

    Ext.define('rssreader.controller.Feeds', {
        extend: 'Ext.app.Controller',

        selectedId: null,
        selectedItemId: null,
        rssItems: [],

        requires: [
            'rssreader.view.feed.Description'
        ],

        refs: [
            {
                ref: 'sourcesList',
                selector: 'rssreader-feed-sources'
            },
            {
                ref: 'tabs',
                selector: 'rssreader-feed-tabs'
            }
        ],

        views: [
            'feed.Items',
            'feed.Sources',
            'feed.Tabs',
            'feed.AddSourceWindow'
        ],

        stores: [
            'Channels',
            'ChannelEntries'
        ],

        models: [
            'Channel',
            'ChannelEntry'
        ],

        channelsSelectionchangeCallback: function (gridPanel, selected) {
            var me = this;
            me.clean();
            if (!Ext.isEmpty(selected)) {
                me.selectedId = selected[0].get('id');
                var url = 'channel/' + me.selectedId;
                me.application.router.navigate(url, {
                    trigger: false
                });
                me.loadItems(me.selectedId);
            }
        },

        clean: function () {
            var me = this;
            me.selectedId = null;
            me.selectedItemId = null;
            me.cleanTabs();
        },

        cleanTabs: function () {
            var me = this;
            var tabs = me.getTabs();
            if (!Ext.isEmpty(tabs) && !Ext.isEmpty(me.rssItems)) {
                Ext.Array.each(me.rssItems, function (it) {
                    if (it.closable) {
                        tabs.remove(it);
                    }
                });
                me.rssItems = [];
            }
        },

        loadChannels: function (selectedId) {
            var me = this;
            me.clean();
            var store = me.getChannelsStore();
            me.selectedId = selectedId;
            (function () {
                var view = me.getSourcesList();
                if (view) {
                    view.un('selectionchange', me.channelsSelectionchangeCallback);
                }
            }());
            store.load({
                callback: function () {
                    var view = me.getSourcesList();
                    if (!Ext.isEmpty(me.selectedId)) {
                        var rec = store.getById(Number(me.selectedId));
                        if (rec) {
                            view.getSelectionModel().select([rec]);
                        }
                    }
                    view.on('selectionchange', me.channelsSelectionchangeCallback, me);
                }
            });
        },

        loadItems: function (channelId, selectedItemId) {
            var me = this;
            if (Ext.isEmpty(channelId)) {
                me.getChannelEntriesStore().removeAll();
                return; // no-op
            }
            var store = me.getChannelEntriesStore();
            var proxy = store.getProxy();
            proxy.url = window.ROOT_URL + 'rest/rss/item/' + channelId;
            if (Ext.isEmpty(selectedItemId)) {
                store.load();
            } else {
                store.load({
                    callback: function () {
                        me.showItem(selectedItemId);
                    }
                });
            }
        },

        showItem: function (selectedItemId) {
            var me = this;
            var store = me.getChannelEntriesStore();
            var rec = store.getById(Number(selectedItemId));
            me.cleanTabs();
            if (!Ext.isEmpty(rec)) {
                var panel = Ext.create('widget.rssreader-feed-description', {
                    title: rec.get('title'),
                    closable: true,
                    link: rec.get('link'),
                    html: rec.get('description')
                });
                var tabs = me.getTabs();
                panel = tabs.add(panel);
                tabs.setActiveTab(panel);
                me.rssItems.push(panel);
                me.selectedItemId = selectedItemId;
            }
        },

        removeFeed: function () {
            var me = this;
            var view = me.getSourcesList();
            var selection = view.getSelectionModel().getSelection();
            if (!Ext.isEmpty(selection)) {
                Ext.each(selection, function (rec) {
                    rec.destroy({
                        success: function () {
                            me.clean();
                            me.application.router.navigate('/', {
                                trigger: true
                            });
                        },
                        failure: function (record, action) {
                            Ext.create('widget.window', {
                                title: 'error',
                                height: 200,
                                width: 400,
                                autoScroll: true,
                                modal: true,
                                html: action.error.statusText
                            }).show();
                        }
                    });
                });
            }
        },

        init: function () {
            var me = this;
            me.control({
                'rssreader-feed-sources': {
                    refreshpanel: function () {
                        window.location.reload();
                    }
                },
                'rssreader-feed-sources > toolbar > button[action=add]': {
                    click: function () {
                        var win = Ext.create('rssreader.view.feed.AddSourceWindow', {});
                        win.on('save', function (data) {
                            win.mask();
                            data.record.save({
                                success: function () {
                                    window.console.log('record persisted', data.record);
                                    me.loadChannels(me.selectedId);
                                    win.close();
                                },
                                failure: function (rec, action) {
                                    Ext.create('widget.window', {
                                        title: 'error',
                                        height: 200,
                                        width: 400,
                                        autoScroll: true,
                                        modal: true,
                                        html: action.error.statusText
                                    }).show();
                                    win.unmask();
                                }
                            });
                        });
                        win.show();
                        win.loadRecord(Ext.create('rssreader.model.Channel'));
                    }
                },
                'rssreader-feed-sources > toolbar > button[action=remove]': {
                    click: function () {
                        me.removeFeed();
                    }
                },
                'rssreader-feed-items': {
                    'itemdblclick': function (gridPanel, selected) {
                        me.selectedItemId = selected.get('id');
                        me.showItem(me.selectedItemId);
                        var url = 'channel/' + me.selectedId + '/' + me.selectedItemId;
                        me.application.router.navigate(url, {
                            trigger: false
                        });
                    }
                }
            });
            me.application.on('show-channel', function (data) {
                me.loadChannels(data.channel);
                me.loadItems(data.channel, data.channelItem);
            });
        }
    });

}());
