// Creating a new table for storing "Active" items

// Add items when they are listed
// Remove items when they are bought or withdrawn

Moralis.Cloud.afterSave("ListedItem", async (request) => {
    // Every event gets triggered twice: When unconfirmed, and when confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()

    logger.info("Looking for confirmed TX")

    if (confirmed) {
        logger.info("Found confirmed TX")
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        const activeItem = new ActiveItem()

        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nft"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        query.equalTo("owner", request.object.get("owner"))

        const alreadyListed = await query.first()

        if (alreadyListed) {
            logger.info(`Deleting ${request.object.get("objectId")}`)
            await alreadyListed.destroy()
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get(
                    "address"
                )} since the listing is was only updated.`
            )
        }

        logger.info(
            `Adding Address: ${request.object.get("address")} TokenId: ${request.object.get(
                "tokenId"
            )}`
        )
        activeItem.set("marketAddress", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nft"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("owner", request.object.get("owner"))

        await activeItem.save()
        logger.info("Saved new ActiveItem.")
    }
})

Moralis.Cloud.afterSave("WithdrawnItem", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Market | Object: ${request.object}`)

    if (confirmed) {
        logger.info("Found confirmed TX")
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        const query = new Moralis.Query(ActiveItem)

        query.equalTo("marketAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nft"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        logger.info(`Market | Query: ${query}`)

        const cancelledItem = await query.first()
        logger.info(`Market | WithdrawnItem: ${query}`)

        if (cancelledItem) {
            logger.info(
                `Deleting ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )} after being withdrawn.`
            )

            await cancelledItem.destroy()
        } else {
            logger.info(
                `No item found at address ${request.object.get(
                    "address"
                )} with tokenId ${request.object.get("tokenId")}`
            )
        }
    }
})

Moralis.Cloud.afterSave("BoughtItem", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()

    logger.info("Looking for confirmed TX")

    if (confirmed) {
        logger.info("Found confirmed TX")
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        const query = new Moralis.Query(ActiveItem)

        query.equalTo("marketAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nft"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        logger.info(`Market | Query: ${query}`)

        const boughtItem = await query.first()

        if (boughtItem) {
            logger.info(
                `Deleting ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )} after being bought.`
            )

            await boughtItem.destroy()
        } else {
            logger.info(
                `No item found at address ${request.object.get(
                    "address"
                )} with tokenId ${request.object.get("tokenId")}`
            )
        }
    }
})
