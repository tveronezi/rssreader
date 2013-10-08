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

    Ext.define('rssreader.view.feed.Sources', {
        extend: 'Ext.grid.Panel',
        alias: 'widget.rssreader-feed-sources',
        title: rssreader.i18n.get('rss_sources'),
        store: 'Channels',
        tools: [
            {
                itemId: 'refresh',
                type: 'refresh',
                handler: function (event, target, owner) {
                    owner.ownerCt.fireEvent('refreshpanel');
                }
            }
        ],
        tbar: [
            {
                xtype: 'button',
                icon: window.ROOT_URL + 'app/resources/img/feed_add.png',
                action: 'add',
                text: rssreader.i18n.get('rss_sources_add')
            },
            {
                xtype: 'button',
                icon: window.ROOT_URL + 'app/resources/img/feed_delete.png',
                action: 'remove',
                text: rssreader.i18n.get('rss_sources_remove')
            }
        ],
        columns: [
            {
                text: rssreader.i18n.get('rss_url'),
                dataIndex: 'title',
                flex: 1
            }
        ]
    });
}());
