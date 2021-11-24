const express = require("express");
const routes = require("./routes");
const exphb = require("express-handlebars");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// set express-handlebars
app.engine(
    "hbs",
    exphb({
        extname: ".hbs",
        helpers: {
            mul: (a, b) => {
                a *= b;
                a += "";
                let mn = a.split("").reverse(),
                    count = 0;
                res = "";
                for (let i = 0; i < mn.length; i++) {
                    count++;
                    res += mn[i];
                    if (count % 3 == 0 && i != mn.length - 1) res += ".";
                }
                return res.split("").reverse().join("");
            },
            sum: (a, b) => a + b,
            vnd: (a) => {
                a += "";
                let mn = a.split("").reverse(),
                    count = 0;
                res = "";
                for (let i = 0; i < mn.length; i++) {
                    count++;
                    res += mn[i];
                    if (count % 3 == 0 && i != mn.length - 1) res += ".";
                }
                return res.split("").reverse().join("");
            },
        },
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname + "/views"));

// set view engine Pug
// app.set('view engine', 'pug')
// app.set('views',path.join(__dirname+'/views'))

////// All routes web ////////
routes(app);

app.listen(3000, () => {
    console.log("server is running at http://localhost:3000");
});
