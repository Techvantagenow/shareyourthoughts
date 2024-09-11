import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let thoughts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    next();
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/express", (req, res) => {
    res.render("express.ejs");
});

app.post("/submit", (req, res) => {
    const newThought = {
        title: req.body.title,
        text: req.body.text,
    };
    thoughts.unshift(newThought);
    res.redirect("/thankyou");
});

app.delete('/delete/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < thoughts.length) {
      thoughts.splice(index, 1);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });

app.get('/edit/:index', (req, res) => {
   const thoughtIndex = req.params.index;
   const thought = thoughts[thoughtIndex];
   res.render('edit', { thought, index: thoughtIndex });
});

app.post("/update/:index", (req, res) => {
    const thoughtIndex = req.params.index;
    thoughts[thoughtIndex] = {
        title: req.body.title,
        text: req.body.text,
    };
    res.redirect("/explore");
});
  
  

app.get("/thankyou", (req, res) => {
    res.render("thankyou.ejs")
})

app.get("/explore", (req, res) => {
    res.render("explore.ejs", {thoughts});
});


app.listen(port, () => {
    console.log(`server is running on port ${port}.`);
});