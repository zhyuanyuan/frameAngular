module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            compile: {
                options: {
                    baseUrl: "./App/scripts",
                    mainConfigFile: "./App/scripts/app.js",
                    optimize: "none",
                    generateSourceMaps: false, //生成map文件
                    preserveLicenseComments: false, //要license
                    useSourceUrl: false,
                    name: "app",
                    out: "dirs/app.js"
                }
            }
        },
        uglify: {
            frameAngular: {
                files: {
                    "dirs/app.min.js": ["dirs/app.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["requirejs"]);
};







