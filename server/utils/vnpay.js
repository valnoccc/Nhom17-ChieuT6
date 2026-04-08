const crypto = require('crypto');
const querystring = require('querystring');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const createVnPayUrl = (req, orderId, amount, bankCode) => {
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : "127.0.0.1");

    let tmnCode = process.env.VNP_TMN_CODE || 'DEMO_TMN_CODE';
    let secretKey = process.env.VNP_HASH_SECRET || 'DEMO_HASH_SECRET';
    let vnpUrl = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    let returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:10000/api/orders/vnpay_return'; // Dùng hiển thị kết quả UI

    let date = new Date();
    let createDate = date.getFullYear().toString() + 
        (date.getMonth() + 1).toString().padStart(2, '0') + 
        date.getDate().toString().padStart(2, '0') + 
        date.getHours().toString().padStart(2, '0') + 
        date.getMinutes().toString().padStart(2, '0') + 
        date.getSeconds().toString().padStart(2, '0');

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
};

const verifyVnPayIpn = (vnp_Params) => {
    let secureHash = vnp_Params['vnp_SecureHash'];
    let secretKey = process.env.VNP_HASH_SECRET || 'DEMO_HASH_SECRET';

    // Copy lại Params để không ảnh hưởng object gốc
    let vnp_Params_Check = { ...vnp_Params };
    
    delete vnp_Params_Check['vnp_SecureHash'];
    delete vnp_Params_Check['vnp_SecureHashType'];

    vnp_Params_Check = sortObject(vnp_Params_Check);
    
    let signData = querystring.stringify(vnp_Params_Check, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

    return secureHash === signed;
};

module.exports = { createVnPayUrl, verifyVnPayIpn };
