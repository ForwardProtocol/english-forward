router.get("/generate-sitemap", async (req, res) => {
    const UserSchema = require("<Schema Path>");
    const { createWriteStream } = require('fs');
    const { SitemapStream } = require('sitemap');

    const { JsonDB } = require('node-json-db');
    const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

    //Temporary DB access In node js
    var tempDb = new JsonDB(new Config("myDataBase", true, false, './'));

    var tempData = tempDb.getData("/users");
    if (Object.keys(tempData).length === 0) {
        tempDb.push("/users", { skip: 0, limit: 1, fileName: 1 });
    }
    var tempData = tempDb.getData("/users");

    let userData = await UserSchema.find({ IsDeleted: 0 }, {}).skip(tempData.skip).limit(tempData.limit);
    
    if (userData.length > 0) {
        const sitemap = new SitemapStream({ hostname: `hostname` });

        const writeStream = createWriteStream(`physical path to to store sitemap` + tempData.fileName + '.xml');
        sitemap.pipe(writeStream);
        for (var k = 0; k < userData.length; k++) {
            var userObj = userData[k];
            sitemap.write({ url: userObj._id, changefreq: 'daily', priority: 0.3, lastmod: new Date() });
        }
        sitemap.end();
        tempDb.push("/users", { skip: tempData.skip + userData.length, limit: 1, fileName: ++tempData.fileName });
        res.send({ status: 1, message: "Generated" });
    } else {
        res.send({ status: 0, message: "---" });
    }
});