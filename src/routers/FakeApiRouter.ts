import express from "express";
var router = express.Router();

/* GET home page. */
//api complete
router.post('/login', function (req, res, next) {
    if ('username' in req.body && 'password' in req.body && req.body.username && req.body.password) {
        req.session!.userid = req.body.username;
        res.send('ok');
    } else {
        res.status(400).send('Bad request');
    }
});
//api complete
router.get('/logoff', function (req, res, next) {
    req.session!.destroy(function (err) {
        res.send('ok');
    });
});
//api complete
router.get('/user', function (req, res, next) {
    if ('userid' in req.session!) {
        if (req.session!.userid === 'joji') {
            res.send({
                "name": "Jiang Sheng",
                "id": 1,
                "balance": 1000,
                "publicKey": "0x324279189aD2ce8ceAF0067f4dE624bA9d293cDB",
                "type": "poor",
                "story": "Sheng lost his wallet, he is starving, need your help to make him feel warm!"
            });
        } else {
            res.send({
                "name": "Jinjie Zhou",
                "id": 2,
                "balance": 90000,
                "publicKey": "0x324279189aD2ce8ceAF0067f4dE624bA9d293cDB",
                "type": "rich"
            });
        }
    } else {
        res.status(400).send('Bad request');
    }
});

router.get('/whoHelpedMe', function (req, res, next) {
    res.send([{
        name: 'Jinjie Zhou',
        balance: 1000,
        date: new Date()
    }, {
        name: 'Xiao Dong Zhu',
        balance: 2000,
        date: new Date()
    }, {
        name: 'Jinjie Zhou',
        balance: 5000,
        date: new Date()
    }]);
});
//api completed but need manual create services to CharityChain first
router.get('/getServiceProviderList', function (req, res, next) {
    res.send([{
        name: 'Blind people massage',
        id: 1,
        price: 20,
        detail: 'Most confortable foot massage provided by blind people, $20 per hour!',
        publicKey: '0xD0AF7efc849A4c11048BA72D4E410061db8E1332'
    }, {
        name: 'KN95 face mask',
        id: 2,
        price: 20,
        detail: 'KN95 face mask which can help you prevent COVID-19, $20 for 20!',
        publicKey: '0xD0AF7efc849A4c11048BA72D4E410061db8E1332'
    }])
});
//api completed
router.post('/buyService', function (req, res, next) {
    res.send({
        txhash: "0xc18a5593e8782b42baef8d209c5f49daccfaf728a0ea448cbf46ab18048b3c32"
    });
});
//api completed
router.post('/donate', function (req, res, next) {
    res.send({
        txhash: "0xc18a5593e8782b42baef8d209c5f49daccfaf728a0ea448cbf46ab18048b3c32"
    });
});
//api completed
router.get('/getPoorUserList', function (req, res, next) {
    res.send([{
        name: 'Jiang Sheng',
        id: 1,
        publicKey: '0x324279189aD2ce8ceAF0067f4dE624bA9d293cDB',
        story: 'Sheng lost his wallet, he is starving, need your help to make him feel warm!',
        type: 'poor',
        balance: 1000
    }, {
        name: 'Jiang Sheng2',
        id: 2,
        publicKey: '0x324279189aD2ce8ceAF0067f4dE624bA9d293cDB',
        story: 'Sheng2 lost his wallet, he is starving, need your help to make him feel warm!',
        type: 'poor',
        balance: 1000
    }, {
        name: 'Jiang Sheng3',
        id: 3,
        publicKey: '0x324279189aD2ce8ceAF0067f4dE624bA9d293cDB',
        story: 'Sheng3 lost his wallet, he is starving, need your help to make him feel warm!',
        type: 'poor',
        balance: 1000
    }])
});

router.post('/whereismymoney', function (req, res, next) {
    if(req.body.count>1){
        res.send([{
            to: 'Peter',
            amount: 1000,
            date: new Date(),
            spent: [{
                name: 'KN95 face mask',
                amount: 10,
                total: 300,
                date: new Date()
            }]
        }])
    }else
    res.send('')
})


router.get('/')

export =router;