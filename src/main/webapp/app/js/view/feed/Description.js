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

    Ext.define('rssreader.view.feed.Description', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.rssreader-feed-description',
        layout: 'fit',
        link: null,
        tbar: [
            {
                xtype: 'button',
                icon: window.ROOT_URL + 'app/resources/img/link.png',
                handler: function () {
                    var panel = this.up('rssreader-feed-description');
                    window.open(panel.link);
                }
            }
        ],
        listeners: {
            afterrender: function (thiscmp) {
                // We don't want that links of rss entries to close our application.
                Ext.each(thiscmp.body.query('a'), function (htmlEl) {
                    var el = Ext.get(htmlEl);
                    el.on('click', function (e) {
                        e.preventDefault();
                        window.open(el.getAttribute('href'));
                    });
                });
            }
        }
    });
}());
