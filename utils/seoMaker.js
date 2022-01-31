const seoMaker = async (productName, description) => {
    var seoTitle, seoDescription, seoTags = [];

    seoTitle = productName + " - Emedilife";

    if (description) {
        seoDescription = description.length >= 200 ?
            description.substring(0, 200).replace(/<\/?[^>]+(>|$)/g, "") : description.replace(/<\/?[^>]+(>|$)/g, "")
        if (seoDescription.length > 150)
            seoDescription = seoDescription.substring(0, 150)
    } else { seoDescription = productName }

    var string = productName;
    string = string.replace(/[^a-zA-Z0-9 ]/g, " ");
    string = string.replace(/  /g, " ")
    var items = string.split(' ');
    items = (items.filter(item => {
        if (item) return item
    }));
    for (let i = 0; i < items.length; i++) {
        for (let j = 1; j <= items.length; j++) {
            const slice = items.slice(i, j);
            if (slice.length)
                seoTags.push(slice.join(' '));
        }
    }
    var count2 = 1;
    seoTags = ((seoTags.filter(item => {
        if ((parseInt(item) != item) && (item.match(/(\w+)/g).length <= 4) && (count2 <= 5) && item.length > 1) {
            count2++
            return item
        }
    })).sort(function (a, b) {
        return a.length - b.length;
    }));
    const object = {
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        seoTags: seoTags
    }
    return object;


}
module.exports = { seoMaker }