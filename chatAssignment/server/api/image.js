module.exports = {
    imageUpload: function(app, formidable, fs, path){
        app.post('/imageUpload', (req, res) => {
            console.log("TEST TEST")


            var form = new formidable.IncomingForm();
            const uploadFolder = path.join(__dirname, "../data/images","files");
            form.maxFileSize = 50 * 1024 * 1024; // 5MB
            form.uploadDir = uploadFolder;

            form.keepExtension = true;
            console.log(form)

            form.parse(req, async (err, fields, files) => {
                console.log("TEST TEST")

                console.log(fields)

                let oldpath = files.image.filepath;
                let newpath = form.uploadDir + "/" + files.image.originalFilename;

                fs.rename(oldpath, newpath, err => {
                    console.log("test3")
                    
                    if(err){
                        console.log("error parsing the files");
                        return res.status(400).json({
                            status: "Fail",
                            message: "There was an error parsing the files",
                            error: err,
                        });
                    }

                    res.send({
                        result:'OK',
                        data:{'filename':files.image.originalFilename,'size':files.image.size},
                        numberOfImages:1,
                        message:"upload successful",
                    });
                    
                });
            });
        });
    },

}