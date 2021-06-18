const axios = require('axios');
var RSS = require('rss');
var fs = require('fs');

var sapo = require('./sapo.js')

axios.get('https://tinhhoaquenha.mysapo.net/admin/blogs/519464/articles.json', {
    headers: {
        'X-Sapo-Access-Token': sapo.token
    }
}).then((res) => {
    var data = res.data.articles.filter((article) => {
        return article.published_on != null;
    }).sort(function (a, b) {
        return new Date(b.published_on) - new Date(a.published_on);
    });
    console.log(data.length);
    createTwitterRss(data)
    createBloggerRss(data)
    createTumblrRss(data)
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
function createTumblrRss(data){
    var feed = new RSS({
        title: 'Công thức nấu ăn - Tinh hoa quê nhà',
        description: 'Tổng hợp các công thức nấu ăn ngon cùng tinh hoa quê nhà',
        pubDate: new Date()
    });
    for (let i = 0; i < 10; i++) {
        var article = data[i];
        var url = 'https://tinhhoaquenha.vn/' + article.alias;
        var img = `<a href="${url}"><img src="${article.image.src}"></a></br>`
        const itemOptions = {
            title: article.meta_title,
            description: img + article.meta_description,
            url: url,
            guid: url,
            date: article.published_on
        };
        feed.item(itemOptions);
    }
    var xml = feed.xml({ indent: true });
    saveXMLFile("tumblr.xml", xml);
}

function createTwitterRss(data) {
    var feed = new RSS({
        title: 'Công thức nấu ăn - Tinh hoa quê nhà',
        description: 'Tổng hợp các công thức nấu ăn ngon cùng tinh hoa quê nhà',
        pubDate: new Date()
    });
    for (let i = 0; i < 10; i++) {
        var article = data[i];
        var url = 'https://tinhhoaquenha.vn/' + article.alias;
        var img = `<a href="${url}"><img src="${article.image.src}"></a></br>`
        const itemOptions = {
            title: article.meta_title + " "+ url,
            description: img + article.meta_description,
            url: url,
            guid: url,
            date: article.published_on
        };
        feed.item(itemOptions);
    }
    var xml = feed.xml({ indent: true });
    saveXMLFile("twitter.xml", xml);
}

function createBloggerRss(data) {
    var feed = new RSS({
        title: 'Công thức nấu ăn - Tinh hoa quê nhà',
        description: 'Tổng hợp các công thức nấu ăn ngon cùng tinh hoa quê nhà',
        pubDate: new Date()
    });
    for (let i = 0; i < 5; i++) {
        var article = data[i];
        var url = `https://tinhhoaquenha.vn/${article.alias}`;
        const itemOptions = {
            title: article.meta_title,
            description: article.content + '<br>Xem chi tiết tại: ' + `<a href="https://tinhhoaquenha.vn/${article.alias}" title="${article.meta_title}">${article.meta_title}</a>`,
            url: url,
            guid: url,
            date: article.published_on
        };
        feed.item(itemOptions);
    }
    var xml = feed.xml({ indent: true });
    saveXMLFile("blogger.xml", xml);
}
