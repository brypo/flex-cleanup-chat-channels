// setup account variables
const accountSid = "ACxxxxx"
const authToken = "xxxxxx"
const flexChatServiceSid = "ISxxxxxx"

// pagination variables
const pageSize = 100
const delayTime = 2000

// get twilio client
const client = require('twilio')(accountSid, authToken)

//delay function to prevent the script from overloading the api
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

// close active channel
const closeChatChannel = async (channel, flexChatServiceSid) => {
    let newAttr = JSON.parse(channel.attributes);

    // set the "status" to INACTIVE
    newAttr.status = "INACTIVE";

    // update chat channel with new attributes
    await client.chat.v2.services(flexChatServiceSid)
        .channels(channel.sid)
        .update({ attributes: JSON.stringify(newAttr) });
}

// filter for active channels
const filterChannelPage = (channelPage) => {
    return channelPage.instances.filter(channel => {
        let attr = JSON.parse(channel.attributes)
        return (attr.status != "INACTIVE")
    })
}

// process one pageSize of channels
const processChannelPage = async (page, flexChatServiceSid) => {
    // filter channels for active 
    const activeChannels = filterChannelPage(page)

    // get page number for logging
    let pageNumber = 0
    if (page.previousPageUrl) {
        let previousPage = new URLSearchParams(page.previousPageUrl)
        pageNumber = parseInt(previousPage.get('Page')) + 1
    }
    // close all channels
    const channelPromises = activeChannels.map(channel => closeChatChannel(channel, flexChatServiceSid))
    await Promise.all(channelPromises).then(() => console.log(`Page ${pageNumber} complete - ${activeChannels.length} closed`))
}

// slowly request and loop through all chat channels
const processAllChannels = async (client, flexChatServiceSid, pageSize, delayTime) => {

    try {
        // get the first chat channel page
        let page = await client.chat.v2.services(flexChatServiceSid)
            .channels
            .page({ pageSize: pageSize })

        do {
            // process the chat channel page
            await processChannelPage(page, flexChatServiceSid)

            // stop when there is no next page
            if (page.nextPageUrl === undefined) {
                break
            }

            // wait before requesting the next page to prevent overloading the Twilio API
            await sleep(delayTime)

            // go to the next page
            page = await page.nextPage()
        }
        while (page.nextPage != undefined)

        console.log("All chats are closed")
    }
    catch (e) {
        console.error(`Error cleaning up residual open chat channels: ${e}`)
    }
}

processAllChannels(client, flexChatServiceSid, pageSize, delayTime)
