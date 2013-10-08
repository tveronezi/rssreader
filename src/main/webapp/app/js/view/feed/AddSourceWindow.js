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

    Ext.define('rssreader.view.feed.AddSourceWindow', {
        extend: 'Ext.window.Window',
        alias: 'widget.rssreader-feed-source-add',
        layout: 'fit',
        title: rssreader.i18n.get('rss_sources_add'),
        renderTo: Ext.getBody(),
        height: 120,
        width: 700,
        modal: true,
        items: [
            {
                xtype: 'form',
                defaultType: 'textfield',
                bodyPadding: 5,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        fieldLabel: rssreader.i18n.get('rss_url'),
                        name: 'link',
                        allowBlank: false
                    }
                ],
                buttons: [
                    {
                        action: 'save',
                        formBind: true,
                        text: rssreader.i18n.get('ok')
                    },
                    {
                        action: 'cancel',
                        text: rssreader.i18n.get('cancel')
                    }
                ]
            }
        ],
        loadRecord: function (record) {
            var me = this;
            me.down('form').loadRecord(record);
        },
        initComponent: function () {
            var me = this;
            rssreader.view.feed.AddSourceWindow.superclass.initComponent.apply(me, arguments);
            me.query('button[action="cancel"]')[0].on('click', function () {
                me.close();
            });
            me.query('button[action="save"]')[0].on('click', function () {
                var form = me.down('form');
                var record = form.getRecord();
                var values = form.getValues();
                Ext.Object.each(values, function (key, value) {
                    record.set(key, value);
                });
                me.fireEvent('save', { record: record });
            });
        }
    });
}());
