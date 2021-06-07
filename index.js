const axios = require('axios');
var RSS = require('rss');
var fs = require('fs');
var fs = require('fs');
var sapo = require('./sapo.js')

axios.get('https://tinhhoaquenha.mysapo.net/admin/blogs/519464/articles.json', {
    headers: {
        'X-Sapo-Access-Token': sapo.token
    }
}).then((res) => {
    var data = res.data.articles.sort(function (a, b) {
        return new Date(b.modified_on) - new Date(a.modified_on);
    }).filter((article)=>{
        return article.published_on != null;
    });
    console.log(data.length);
    createTwitterRss(data)
}).catch((error) => {
    console.error(error)
})

function saveXMLFile(path, xml) {
    fs.writeFile(
        path,
        xml,
        function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log("The file was saved!");
            }
        }
    );
}

// -------------------- twitter ----------------------------
function createTwitterRss(data){
    var feed = new RSS({
        title: 'Công thức nấu ăn - Tinh hoa quê nhà',
        description: 'Tổng hợp các công thức nấu ăn ngon cùng tinh hoa quê nhà',
        pubDate: data[0].modified_on,
    });
    for (let i = 0; i < 1; i++) {
        var article = data[i];
        const itemOptions = {
            title: article.meta_title,
            description: article.meta_description,
            url: 'https://tinhhoaquenha.vn/' + article.alias,
            guid: 'https://tinhhoaquenha.vn/' + article.alias,
            date: article.published_on
        };
        feed.item(itemOptions);
    }
    var xml = feed.xml({ indent: true });
    saveXMLFile("twitter.xml", xml);
}

