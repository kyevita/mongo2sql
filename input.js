module.exports = [
    "db.user.find({name: 'john'});",
    'db.user.find({_id: 23113},{name: 1, age: 1});',
    'db.user.find({age: {$gte: 21}},{name: 1, _id: 1});',
    'db.user.find({deleted: true, isAdmin: false},{name: 1, _id: 1});',
    'db.user.find({age: {$gte: 21, $lte: 21, $in: [1,2]} },{name: 1, _id: 1});',
    "db.user.find({age: {$gte: 21}, name:{$in:['john', 'elena']}},{name: 1, _id: 1});",
    "db.user.find({age: {$lte: 50}, $or:[{name: {$ne: 'tommy'}}, {age: {$gte:21}}] },{name: 1, _id: 1});",
    'dqwfqb.fwqwf.find(fqeqfqwfq);',
    "db.user.find({$or: [{$and: [{'name': {$ne: 'tommy'}, age: {$gte: 21}}] }, { $and: [{'name':'tommy', age: {$lte: 21}}]}]},{name: 1, _id: 1});",
    'invalidQuery',
    {},
    null,
];
