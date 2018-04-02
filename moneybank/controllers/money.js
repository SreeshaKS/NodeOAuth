
var Money = require('../models/money');

exports.postMoney = function (req, res) {
    var money = new Money();

    money.name = req.body.name;
    money.type = req.body.type;
    money.quantity = req.body.quantity; 
    money.userId = req.user._id;

    money.save(function (err) {
        if (err)
            res.send(err);

        res.json({ message: 'money added to the bank!', data: money });
    });
}

exports.getMoney = function (req, res) {
    console.log(req.user)
    Money.find({ userId: req.user._id/*, _id: req.params.trans_id*/ },function (err, money) {
        if (err)
            res.send(err);

        res.json(money);
    });
}

exports.getTrans = function (req, res) {

    Money.find({ userId: req.user._id, _id:req.params.trans_id}, function (err, money) {
        if (err)
            res.send(err);

        res.json(money);
    });
}

exports.updateTrans = function (req, res) {
    Money.update({ userId: req.user._id, _id: req.params.trans_id}, function (err, money) {
        if (err)
            res.send(err);

        money.type = req.body.type;

        money.save(function (err) {
            if (err)
                res.send(err);

            res.json(money);
        });
    });
}

exports.deleteTrans = function (req, res) {
    Money.remove({ userId: req.user._id, _id: req.params.trans_id}, function (err) {
        if (err)
            res.send(err);

        res.json({ message: 'Money removed from Bank !' });
    });
}