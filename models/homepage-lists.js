const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    shopByCategory: [{
        name: {
            type: Number,
            required: false
        },
        image: {
            type: Number,
            required: false
        },
        slug: {
            type: Number,
            required: false
        }
    }],
    dealsOfTheDayList: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        priority: {
            type: Number,
            required: false
        }
    }],
    brandList: [{
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'ProductBrand'
        },
        priority: {
            type: Number,
            required: false
        }
    }],
    dealsOnPlay: [{
        name: {
            type: String,
            required: false
        },
        shortDesc: {
            type: String,
            required: false
        },
        info: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        },
        routerLink: {
            type: String,
            required: false
        },
        cardBackground: {
            type: String,
            required: false
        },
        cardBtnColor: {
            type: String,
            required: false
        },
        priority: {
            type: Number,
            required: false
        }
    }],
    selectedCategory1: {
        categoryName: {
            type: String,
            required: false
        },
        shortDesc: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        },
        routerLink: {
            type: String,
            required: false
        },
        solid: {
            type: String,
            required: false
        },
        rgba: {
            type: String,
            required: false
        },
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }],
        priority: {
            type: Number,
            required: false
        }
    },
    selectedCategory2: {
        categoryName: {
            type: String,
            required: false
        },
        shortDesc: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        },
        routerLink: {
            type: String,
            required: false
        },
        solid: {
            type: String,
            required: false
        },
        rgba: {
            type: String,
            required: false
        },
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }],
        priority: {
            type: Number,
            required: false
        }
    },
    selectedCategory3: {
        categoryName: {
            type: String,
            required: false
        },
        shortDesc: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        },
        routerLink: {
            type: String,
            required: false
        },
        solid: {
            type: String,
            required: false
        },
        rgba: {
            type: String,
            required: false
        },
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }],
        priority: {
            type: Number,
            required: false
        }
    },
    featured: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        priority: {
            type: Number,
            required: false
        }
    }],
    bestSeller: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        priority: {
            type: Number,
            required: false
        }
    }],
    specialProduct: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        priority: {
            type: Number,
            required: false
        }
    }],
    recommendedForYou: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        priority: {
            type: Number,
            required: false
        }
    }]
}, {
    timestamps: false
});


module.exports = mongoose.model('HomepageLists', schema);
