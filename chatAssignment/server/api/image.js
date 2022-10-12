module.exports = {
    imageUpload: function(app, formidable, fs, path){
        app.post('/imageUpload', (req, res) => {
            var form = new formidable.IncomingForm();
            const uploadFolder = path.join(__dirname, "../data/images");
            form.uploadDir = uploadFolder;

            form.keepExtension = true;

            form.parse(req, async (err, fields, files) => {

                let oldpath = files.image.path || "";
                let newpath = form.uploadDir + "/" + files.image.name;

                fs.rename(oldpath, newpath, err => {
                    if(err){
                        return res.status(400).json({
                            status: "Fail",
                            message: "There was an error parsing the files",
                            error: err,
                        });
                    }

                    res.send({
                        result:'OK',
                        data:{'filename':files.image.name,'size':files.image.size},
                        numberOfImages:1,
                        message:"upload successful",
                    });
                    
                });
            });
        });
    },

}