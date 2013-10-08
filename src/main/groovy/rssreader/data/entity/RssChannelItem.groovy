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

package rssreader.data.entity

import javax.persistence.*

@Entity
@Table(name = 'rsschannel_item', uniqueConstraints = @UniqueConstraint(columnNames = ['channel_id', 'item_link']))
class RssChannelItem extends BaseEntity {

    @Column(nullable = false, length = 1000)
    String title

    @Column(name = 'item_link', nullable = false, length = 1000)
    String link

    @Column(nullable = false)
    @Lob
    String description

    @ManyToOne(optional = false)
    @JoinColumn(name = "channel_id", nullable = false, updatable = false)
    RssChannel channel

}
