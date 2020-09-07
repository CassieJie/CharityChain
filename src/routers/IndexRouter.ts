import express from "express";
import path from "path";
import { User, USER_TYPE } from "../classes/User";
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if ('userid' in req.session!) {
        res.sendFile(path.join(__dirname, '../../dist', 'user.html'));
    } else {
        res.sendFile(path.join(__dirname, '../../dist', 'login.html'));
    }
});

export =router;