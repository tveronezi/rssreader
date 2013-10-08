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

package rssreader.rest

import rssreader.data.dto.RssChannelDto
import rssreader.data.dto.RssChannelItemDto
import rssreader.data.entity.RssChannel
import rssreader.data.entity.RssChannelItem
import rssreader.service.FeedImpl

import javax.inject.Inject
import javax.ws.rs.*

@Path("/rss")
class Rss {

    @Inject
    private FeedImpl service

    @GET
    @Path("/channel")
    @Produces("application/json")
    List<RssChannelDto> listChannels() {
        service.getChannels().collect { RssChannel channel ->
            new RssChannelDto(
                    id: channel.uid,
                    title: channel.title,
                    link: channel.link
            )
        } as List<RssChannelDto>
    }

    @POST
    @Path("/channel")
    @Produces("application/json")
    @Consumes("application/json")
    RssChannelDto postChannel(RssChannelDto dto) {
        def channel = service.saveChannel(dto.link)
        new RssChannelDto(
                id: channel.uid,
                title: channel.title,
                link: channel.link
        )
    }

    @DELETE
    @Path("/channel/{id}")
    void deleteChannel(@PathParam('id') Long id) {
        service.deleteChannel(id)
    }

    @GET
    @Path("/item/{channelUid}")
    @Produces("application/json")
    List<RssChannelItemDto> listItems(@PathParam("channelUid") Long channelUid) {
        service.getItems(channelUid).collect { RssChannelItem item ->
            new RssChannelItemDto(
                    id: item.uid,
                    title: item.title,
                    link: item.link,
                    description: item.description
            )
        } as List<RssChannelItemDto>
    }
}
