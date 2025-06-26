export function validationAuctionForm(data) {
    const errors = {};
    let isValid = true;

    if(!data.auctionName) {
        errors.auctionName = "Auction name is required.";
        isValid = false;
    }

    if(!data.auctionDescription) {
        errors.auctionDescription = "Auction description is required.";
        isValid = false;
    }

    if (!data.auctionPrice) {
        errors.auctionPrice = "Auction price is required.";
        isValid = false;
    } else if (isNaN(data.auctionPrice) || Number(data.auctionPrice) <= 10) {
        errors.auctionPrice = "Auction price must be greater than 10.";
        isValid = false;
    }

    if (!data.auctionDate) {
        errors.auctionDate = "Auction date is required.";
        isValid = false;
    } else {
        const now = new Date();
        const auctionDate = new Date(data.auctionDate);
        const diffInMs = auctionDate - now;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours < 24) {
            errors.auctionDate = "Auction date must be at least 24 hours from now.";
            isValid = false;
        }
    }

    return { isValid, errors };
}