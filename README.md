# Twilio Flex - Close Legacy Chat Channels
Node.js Script to deactivate **all** (SMS, Webchat, WhatsApp, etc.) Flex Legacy Chat Channels.

## What does this do?
This script will paginate through the Twilio Chat Channels API, pulling and processing 100 Channels at a time. This delay is intentional to prevent from reaching the Twilio API rate limits.

For each Channel page, it will filter down to only "ACTIVE" channels and update them to "INACTIVE".

## Warnings
This script should not be run while you have open TaskRouter Tasks associated to these legacy Chat Channels. If a Chat Channel is deactivated while a Task is open, the Flex agent will experience errors when trying to `wrapup` or `complete` the Task. 

Ensure all TaskRouter SMS/Chat Tasks are "completed" or "canceled" before running this script. 

## Instructions
1.  Ensure you have the [Twilio Node helper library](https://twilio.com/docs/libraries/reference/twilio-node/) installed
2.  Update the script variables at the top with your specific account identifiers.
3.  In terminal, navigate to the directory where you saved this file.
4.  Run `node deactivateAllChannels.js`

## Disclaimer

This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.
