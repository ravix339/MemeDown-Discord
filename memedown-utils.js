const FormData = require('form-data');
const axios = require("axios");

exports.methods =  { sendMessage, isValidImage, getMemeCode }

async function sendMessage(endpoint, code, imgUrl = null) {
    form = FormData();
    form.append('code', code);
    if (!(imgUrl === null))
    {
        try {
            img = await getImage(imgUrl);
            form.append('img', img);
        } catch (e) {
            throw e;
        }
    }

    return axios({
        method: "post",
        url: endpoint,
        data: form,
        headers: { ...form.getHeaders() }
    })
    .then(function (response) {
        console.log("received successful response");
        return response.data.data.replace(/^data:image\/(png|gif|jpeg);base64,/,'');
    })
    .catch(function (error) {
        console.error(error.response.data.err);
        throw new Error(error.response.data.err);
    });

}

function isValidImage(url) {
    return /(https:)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(url);
}

function getMemeCode(rawMsgContent) {
    let msgContent = rawMsgContent.replace((/  |\r\n|\n|\r/gm),"");
    let open = msgContent.indexOf("<meme>");
    let close = msgContent.lastIndexOf("</meme>");

    if (open === -1) {
        throw "No <meme> tag in message";
    }
    else if (close === -1) {
        throw "No </meme> tag in message";
    }

    return msgContent.slice(open, close+"</meme>".length);
}

function getImage(url) {
    return axios({
        method: "get",
        url,
        responseType: 'arraybuffer',
    }).then( (response) => {
        console.log("Successfully fetched image data");
        return Buffer.from(response.data, 'binary').toString('base64');
    }).catch( (error) => {
        if ("response" in error)
            throw new Error(`Could not fetch url. Return code ${error.response.status}`);
        throw new Error("Could not fetch url - no response");

    });
}
