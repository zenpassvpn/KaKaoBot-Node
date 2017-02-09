/**
 * Created by cheese on 2017. 2. 9..
 */

const request = require('request');
const url = 'http://dormi.mokpo.ac.kr/www/bbs/board.php?bo_table=food';

const Bot = {};
const cheerio = require('cheerio');

let menu = {
    message: {
        text: null,
    },
    keyboard: {
        type: 'buttons',
        buttons: ["교내식단", "메뉴2", "메뉴3"]
    }
};
Bot.choseMenu = (content, callback) => {
    
    switch (content) {
        case '교내식단':
            Bot.diet((err, result) => {
                
                menu.message.text = result;
                callback(err, menu);
            });
            break;
        case '메뉴2':
            menu.message.text = '테스트 중입니다.';
            callback(null, menu);
            break;
        case '':
            break;
        default:
            menu.message.text = '선택하신 메뉴는 존재하지 않습니다.';
            callback(null, menu);
            break;
    }
};

Bot.diet = (callback) => {
    
    request.get(url, (err, res, html) => {
        
        if (!err && res.statusCode === 200) {
            let $ = cheerio.load(html);
            
            let diet = null;
            
            $('.tbline31 tr').each(function () {
                diet = '----------아침---------\r\n';
                diet +=$(this).find("td").eq(0).text();
                diet +='----------점심---------\r\n';
                diet += $(this).find("td").eq(1).text();
                diet +='----------저녁---------\r\n';
                diet += $(this).find("td").eq(2).text();
            });
            
            
            // callback(null, JSON.stringify(diet));
            callback(null, diet);
            
        } else {
            callback(err, '다시 시도해주세요');
        }
    });
};


module.exports = Bot;