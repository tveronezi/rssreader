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
import org.xml.sax.SAXException
import rssreader.data.dto.RssChannelDto
import rssreader.data.dto.RssChannelItemDto

import javax.enterprise.context.ApplicationScoped

@ApplicationScoped
class FeedReaderImpl {
    private static def LOG = LoggerFactory.getLogger(FeedReaderImpl)

    void read(String url, callback) {
        def source = new URI(url)
        def is = source.toURL().openStream()
        def rawContent
        try {
            rawContent = new XmlSlurper().parse(is)
        } catch (SAXException ex) {
            LOG.error("Impossible to read xml Content: ${is.text}", ex)
            return
        } catch (IOException ex) {
            LOG.error('Impossible to read xml', ex)
            return
        } finally {
            try {
                is.close()
            } catch (ignore) {}
        }
        def channel = rawContent.channel
        def items = []
        channel.childNodes().each {
            if (it.name() == 'item') {
                items << it
            }
        }
        def channelDto = new RssChannelDto(
                title: channel.title.text(),
                link: channel.link.text()
        )
        def itemDtoList = items.collect { item ->
            def dto = new RssChannelItemDto()
            item.children().each { attr ->
                switch (attr.name()) {
                    case ['title', 'link', 'description']:
                        dto[attr.name() as String] = attr.text()
                        break
                    default:
                        break
                }

            }
            dto
        }
        callback(channelDto, itemDtoList)
    }

}
