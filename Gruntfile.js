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


module.exports = function (grunt) {
/*    var requireJsModules = [];
    grunt.file.expand({cwd:"./App/scripts/"}, "**!/!*.js").forEach( function (file) {
        if(file !='app.js'){
            requireJsModules.push(file);
        }
    });*/
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/!*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> *!/\n'
            },
            buildall: {
                options: {
                    mangle: true,
                    compress: {
                        drop_console: true
                    },
                    report: "gzip" //输出压缩率，可选的值有 false(不输出信息)，gzip
                },
                files: [{
                    expand: true,
                    cwd: 'App/scripts', //js目录下
                    src: 'app.common.js', //js文件
                    dest: 'App/app.min' //输出到此目录下
                }]
            }
        },
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
                    out: "App/app.min/app.common.js"
                }
            }
        },
        watch: {
            scripts: {
                files: ['App/scripts/**/*.js'],
                tasks: ['minall'],
                options: {
                    spawn: true,
                    interrupt: true
                }
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-watch');

    // 默认被执行的任务列表。
    //grunt.registerTask('minall', ['uglify:buildall']);
    grunt.registerTask('default', ['requirejs']);
};




