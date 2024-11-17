const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
    query: {type: String, required: true},
    searchCount: {type: Number, default: 1},
},{
    timestamps: true
});

querySchema.methods.toJSON = function() {
    const obj = this._doc;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
}

const Query = mongoose.model("Query", querySchema);

module.exports = Query;