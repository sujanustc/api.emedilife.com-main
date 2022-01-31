const errorResponse = (res, message = "") => {
    return res.status(500).json({
        status: false,
        message,
    });
};

const response = (res, { status = true, statusCode = 200, message = "success" }, data) => {
    return res.status(statusCode).json({
        status,
        message,
        data: data,
    });
};

const Product = require('../models/product.js')
const getNewListWithCount = (results, fieldName, next) => {
    var newData = [];
    results.forEach(async (item, index) => {
        var count2 = await Product.countDocuments({ fieldName: item.slug });
        newData.push({
            ...item._doc,
            productCount: count2,
        })
        if (index === results.length - 1) next(newData)
    });
}

const getOffset = (page, limit) => {
    let defaultLimit = 10;
    !limit ? (limit = defaultLimit) : null;
    !page ? (page = 1) : null;
    page = parseInt(page);
    limit = parseInt(limit);
    page === 0 ? (page = 1) : null;
    limit === 0 ? (limit = defaultLimit) : null;
    let offset = parseInt((page - 1) * limit);
    return {
        offset, limit, page
    }
};

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

// function shuffle(a) {
//     var j, x, i;
//     for (i = a.length - 1; i > 0; i--) {
//         j = round(random() * (i + 1));
//         x = a[i];
//         a[i] = a[j];
//         a[j] = x;
//     }
//     return a;
// }
function convertToSlug(Text)
{
    return Text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}

const getMetaData = async (currentPage, count, offset, limit)=>{
    var totalPage = count % limit == 0 ? count / limit : Math.ceil(count / limit)
    var page = parseInt(currentPage)
    var metaTags = {
        currentPage: page,
        hasNextPage: page < totalPage,
        nextPage: page < totalPage ? page + 1 : null,
        hasPreviousPage: offset > 0 && offset < count,
        previousPage: offset > 0 && offset < count ? page - 1 : null,
        totalPage: totalPage,
        count: count
    }
    return metaTags
}
module.exports = {
    errorResponse,
    response,
    getNewListWithCount,
    getOffset,
    shuffle,
    convertToSlug,
    getMetaData
};
