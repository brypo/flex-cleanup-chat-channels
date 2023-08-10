# Twilio Flex - Close Legacy Chat Channels
Node.js Script to deactivate **all** (SMS, Webchat, WhatsApp, etc.) Flex Legacy Chat Channels.

## What does this do?
This script will paginate through the Twilio Chat Channels API, pulling and processing 100 Channels at a time. This delay is intentional to prevent from reaching the Twilio API rate limits.

For each Channel page, it will filter down to only "ACTIVE" channels and update them to "INACTIVE".

## Instructions
1.  Ensure you have the [Twilio Node helper library](https://twilio.com/docs/libraries/reference/twilio-node/) installed
2.  Update the account variables with your SIDs
3.  Run `node deactivateAllChannels.js`
