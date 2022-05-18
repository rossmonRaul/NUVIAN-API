"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAutenticationLogin = void 0;
const connection_1 = require("../database/connection");
const mssql_1 = __importDefault(require("mssql"));
var jwt = require('jsonwebtoken');
var express = require('express');
const postAutenticationLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //validations 
    try {
        //cont var to login
        const cedula = req.params.cedula;
        const password = req.params.password;
        //if id and passwor equals 0 
        if (!cedula || !password) {
            res.status(400).json({
                ok: false,
                message: 'Please enter username and password'
            });
        }
        else {
            //get connection
            const pool = yield (0, connection_1.getConnetion)();
            const { recordset: users } = yield pool.request()
                .input('Cedula', mssql_1.default.VarChar(50), cedula)
                .input('Contraseña', mssql_1.default.VarChar(50), password)
                .execute('SP_Usuario_Inicio_de_sesion');
            pool.close();
            // var to get ID_airport
            const { Cedula, ID_Aeropuerto } = users[0];
            const user = { Cedula, ID_Aeropuerto };
            if (users.length === 0) {
                return res.status(404).json({
                    ok: false,
                    msg: 'You are not logged' + cedula
                });
            }
            return res.status(200).json({
                ok: true,
                cedula: cedula,
                airport: user
                //token: token
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: 'Error while trying to log in', error: err
        });
    }
});
exports.postAutenticationLogin = postAutenticationLogin;
//# sourceMappingURL=user.controllers.js.map