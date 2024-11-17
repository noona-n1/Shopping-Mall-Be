const Query = require("../models/Query");

const queryController = {};

queryController.setQuery = async (req, res) => {
    try {
        const {query} = req.body;
        
        // 기존 쿼리 검색
        let existingQuery = await Query.findOne({ query });
        
        if (existingQuery) {
            // 기존 쿼리가 있으면 searchCount 증가
            existingQuery.searchCount = (existingQuery.searchCount || 0) + 1;
            await existingQuery.save();
        } else {
            // 새로운 쿼리 생성
            const newQuery = new Query({
                query,
                searchCount: 1
            });
            await newQuery.save();
        }
        
        return res.status(200).json({ status: "success" });
    } catch (error) {
        return res.status(400).json({status: "fail", error: error.message});
    }
}

queryController.getQueries = async (req, res) => {
    try {
        // searchCount 기준 정렬, 상위 10개
        const queries = await Query.find().sort({ searchCount: -1 }).limit(10);

        return res.status(200).json({ status: "success", queries });
    } catch (error) {
        return res.status(400).json({status: "fail", error: error.message});
    }
}

module.exports = queryController;