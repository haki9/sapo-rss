const axios = require('axios');
var RSS = require('rss');
var fs = require('fs');

var sapo = require('./sapo.js')

function updateAndSaveLastPost(published_on) {
    let post = {
        "published_on": published_on
    };
    let data = JSON.stringify(post);
    fs.writeFileSync('data.json', data);
}

function getLastPost() {
    let data = fs.readFileSync('data.json');
    var post = JSON.parse(data);
    return post ? post.published_on : 0;
}

var page = 22;
var limit = 250;
var data;

axios.get('https://tinhhoaquenha.mysapo.net/admin/blogs/519464/articles.json?limit=250', {
    headers: {
        'X-Sapo-Access-Token': sapo.token
    }
}).then((res) => {
    
    var dataGN = res.data.articles.filter((article) => {
        return article.published_on != null
    }).sort(function (a, b) {
        return new Date(b.published_on) - new Date(a.published_on);
    })

    dataGN = dataGN.slice(0, 20)
    console.log(dataGN.length)
    createGoogleNewsRss(dataGN)

    var lastPost = getLastPost();
    console.log(res.data.articles.length);
    var data = res.data.articles.filter((article) => {
        return article.published_on != null && new Date(article.published_on) > new Date(lastPost);
    }).sort(function (a, b) {
        return new Date(b.published_on) - new Date(a.published_on);
    });

    console.log("New Posts: " + data.length);
    // console.log(JSON.stringify(data));

    if (!data || data.length <= 0) return;
    lastPost = data[0].published_on;
    updateAndSaveLastPost(lastPost);
    console.log(`NewLastPost: ${lastPost}`);

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
function createGoogleNewsRss(data) {
    var feed = new RSS({
        title: 'C??ng th???c n???u ??n - Tinh hoa qu?? nh??',
        description: 'T???ng h???p c??c c??ng th???c n???u ??n ngon c??ng tinh hoa qu?? nh??',
        pubDate: new Date()
    });
    for (let i = 0; i < data.length; i++) {
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
    var xml = feed.xml({
        indent: true
    });
    saveXMLFile("googlenews.xml", xml);
}


function createTumblrRss(data) {
    var feed = new RSS({
        title: 'C??ng th???c n???u ??n - Tinh hoa qu?? nh??',
        description: 'T???ng h???p c??c c??ng th???c n???u ??n ngon c??ng tinh hoa qu?? nh??',
        pubDate: new Date()
    });
    for (let i = 0; i < data.length; i++) {
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
    var xml = feed.xml({
        indent: true
    });
    saveXMLFile("tumblr.xml", xml);
}

function createTwitterRss(data) {
    var feed = new RSS({
        title: 'C??ng th???c n???u ??n - Tinh hoa qu?? nh??',
        description: 'T???ng h???p c??c c??ng th???c n???u ??n ngon c??ng tinh hoa qu?? nh??',
        pubDate: new Date()
    });
    for (let i = 0; i < data.length; i++) {
        var article = data[i];
        var url = 'https://tinhhoaquenha.vn/' + article.alias;
        var img = `<a href="${url}"><img src="${article.image.src}"></a></br>`
        const itemOptions = {
            title: article.meta_title + " " + url,
            description: img + article.meta_description,
            url: url,
            guid: url,
            date: article.published_on
        };
        feed.item(itemOptions);
    }
    var xml = feed.xml({
        indent: true
    });
    saveXMLFile("twitter.xml", xml);
}

function createBloggerRss(data) {
    var feed = new RSS({
        title: 'C??ng th???c n???u ??n - Tinh hoa qu?? nh??',
        description: 'T???ng h???p c??c c??ng th???c n???u ??n ngon c??ng tinh hoa qu?? nh??',
        pubDate: new Date()
    });
    for (let i = 0; i < data.length; i++) {
        var article = data[i];
        var url = `https://tinhhoaquenha.vn/${article.alias}`;
        const itemOptions = {
            title: article.meta_title,
            description: article.content + '<br>Xem chi ti???t t???i: ' + `<a href="https://tinhhoaquenha.vn/${article.alias}" title="${article.meta_title}">${article.meta_title}</a>`,
            url: url,
            guid: url,
            date: article.published_on
        };
        feed.item(itemOptions);
    }
    var xml = feed.xml({
        indent: true
    });
    saveXMLFile("blogger.xml", xml);
}