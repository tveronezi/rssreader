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

package rssreader.service

import org.slf4j.LoggerFactory
import rssreader.data.dto.RssChannelItemDto
import rssreader.data.entity.RssChannel
import rssreader.data.entity.RssChannelItem

import javax.ejb.Schedule
import javax.ejb.Stateless
import javax.inject.Inject
import javax.persistence.EntityManager

@Stateless
class FeedImpl {
    private static def LOG = LoggerFactory.getLogger(FeedImpl)

    @Inject
    private BaseEAO baseEAO

    @Inject
    private FeedReaderImpl reader

    void deleteChannel(Long id) {
        baseEAO.execute({ EntityManager entityManager ->
            def channel = entityManager.find(RssChannel, id)
            if (channel) {
                entityManager.remove(channel)
                entityManager.flush()
            }
        })
    }

    RssChannel saveChannel(String url) {
        RssChannel channel = null
        reader.read(url, { channelDto, itemDtoList ->
            channel = baseEAO.findUnique({ EntityManager em ->
                def query = em.createQuery('SELECT c FROM RssChannel c WHERE c.link = :plink')
                query.setParameter('plink', url)
                query
            }) as RssChannel
            if (!channel) {
                // add channel if it is not there yet
                channel = new RssChannel(
                        title: channelDto.title,
                        link: channelDto.link
                )
                baseEAO.execute({ EntityManager em ->
                    em.persist(channel)
                    em.flush()
                })
            }
            itemDtoList.each { RssChannelItemDto item ->
                saveItem(channel, item)
            }
        })
        channel
    }

    List<RssChannel> getChannels() {
        baseEAO.findAll(RssChannel)
    }

    @Schedule(minute = "*/5", hour = "*")
    void updateChannels() {
        getChannels().each { RssChannel channel ->
            try {
                saveChannel(channel.link)
            } catch (ignore) {
                // something went wrong while updating the feeds
            }
        }
    }

    List<RssChannelItem> getItems(Long channelUid) {
        baseEAO.execute({ EntityManager em ->
            def query = em.createQuery('SELECT i FROM RssChannelItem i WHERE i.channel.uid = :pchannel')
            query.setParameter('pchannel', channelUid)
            query.resultList
        }) as List<RssChannelItem>
    }

    private void saveItem(RssChannel channel, RssChannelItemDto dto) {
        def item = baseEAO.findUnique({ EntityManager em ->
            def query = em.createQuery('SELECT i FROM RssChannelItem i WHERE i.link = :plink AND i.channel = :pchannel')
            query.setParameter('plink', dto.link)
            query.setParameter('pchannel', channel)
            query
        })
        if (!item) {
            // add item if it is not there yet
            item = new RssChannelItem(
                    title: dto.title,
                    link: dto.link,
                    description: dto.description,
                    channel: channel
            )
            try {
                baseEAO.execute({ EntityManager em ->
                    em.persist(item)
                    em.flush()
                })
            } catch (ex) {
                LOG.error('Impossible to save rss entry', ex)
            }
        }
    }
}
