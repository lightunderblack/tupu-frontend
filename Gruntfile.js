module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        less: {
            dev: {
                options: {
                    modifyVars: {
                        imgPath: '"https://dn-tupu-dev.qbox.me/img"'  
                    }
                },

                files: {
                    "./assets/css/style.css": "./static/css/main.less"
                }                
            },

            product: {
                options: {
                    modifyVars: {
                        imgPath: '"https://dn-tupu-asset.qbox.me/img"'
                    }
                },

                files: {
                    "./assets/css/style.css": "./static/css/main.less"
                }                                    
            }
        },

        uglify: {
            product: {
                files: [{
                    expand: true,
                    src: "*.js",
                    cwd: "assets/js",
                    dest: "static/js"
                }]                             
            }
        },

        cssmin: {
            product: {
                files: {
                    "./static/css/style.css": "./assets/css/style.css"
                }                                
            }
        },

        imagemin: {
            product: {
                files: [{
                    expand: true,
                    cwd: "assets/img",
                    dest: "static/img",
                    src: ["**/*.{png,jpg,jpeg,gif}"]
                }]                               
            }
        },

        watch: {
            css: {
                files: ["./static/**/*.less"],
                tasks: ["less:product", "cssmin:product"]
            }
        },

        clean: {
            img: "./img",
            css: ["./assets/css"],
            vue: ["./assets/js/vue"]
        },

        copy: {
            img: {
                src: "**",
                expand: true,
                dest: "./img",
                cwd: "./assets/img/"
            },

            vue: {
                src: "**",
                expand: true,
                dest: "./static/js",
                cwd: "./assets/js/vue/"
            }
        },

        compass: {
            options: {
                force: true,
                imagesDir: "img",
                cssDir: "assets/css",
                sassDir: "assets/sass", 
                environment: "production",
                javascriptsDir: "assets/js"               
            },

            local: {
                options: {                 
                    imagesDir: "assets/img",
                    environment: "development",
                    httpPath: "http://127.0.0.1:8080/"
                }
            },

            dev: {
                options: {
                    httpPath: "https://dn-tupu-dev.qbox.me/"
                }
            },

            product: {
                options: {
                    httpPath: "https://dn-tupu-asset.qbox.me/"
                }
            }
        },

        exec: {
            dev: "npm run dev",
            build: "npm run build"
        }
    });

    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.registerTask("default", [
        "watch"
    ]);

    grunt.registerTask("local", [
        "clean:img", 
        "compass:local", 
        "exec:dev"
    ]);

    grunt.registerTask("dev", [
        "clean:img", 
        "copy:img", 
        "clean:css", 
        "compass:dev", 
        "clean:img", 
        "less:dev", 
        "clean:vue", 
        "exec:build", 
        "copy:vue", 
        "clean:vue", 
        "cssmin:product", 
        "imagemin:product"
    ]);

    grunt.registerTask("product", [
        "clean:img", 
        "copy:img", 
        "clean:css", 
        "compass:product", 
        "clean:img", 
        "less:product", 
        "clean:vue", 
        "exec:build", 
        "copy:vue", 
        "clean:vue",         
        "cssmin:product", 
        "uglify:product", 
        "imagemin:product"
    ]);
};