"use strict"

const http = require("http");
const fs = require("fs");
const todos = [];
http.createServer((req, res)=>{
  if (req.url==="/"){
    fs.readFile("./public/index.html", (err, data)=>{
      res.statusCode = 200;
      res.end(data);
    });
  }
  else if (req.url==="/initialTodos" && req.method==="GET"){
      res.end(JSON.stringify(todos));
  }
  else if (req.url==="/todoAdd" && req.method==="POST"){
      req.on("data", (obj)=>{
        const object = JSON.parse(obj);
        object.id = Math.random();
        todos.push(object);
      });
      req.on("end", ()=>{
        res.end(JSON.stringify(todos));
      });
  }
  else if (req.url==="/todoCheckedChange" && req.method==="PUT"){
    req.on("data", (obj)=>{
      const id = JSON.parse(obj).itemid*1;
      for (let i=0; i<=todos.length-1; i++){
        if (todos[i].id === id){
          todos[i].checked = !todos[i].checked;
        }
      }
    });
    req.on("end", ()=>{
      res.end(JSON.stringify(todos));
    });
  }
  else if (req.url==="/todoSearch" && req.method==="POST"){
    let searchedTodos = [];
    req.on("data", (obj)=>{
      const searchText = JSON.parse(obj).searchText.toLowerCase();
      if (searchText==="")
        searchedTodos = todos;
      else {
        for (let i=0; i<=todos.length-1; i++){
          if (todos[i].todo.toLowerCase().search(searchText)>=0)
            searchedTodos.push(todos[i]);
        }
      }
    });
    req.on("end", ()=>{
      res.end(JSON.stringify(searchedTodos));
    });
  }
  else if (req.url==="/todoDelete" && req.method==="DELETE"){
      req.on("data", (obj)=>{
        const id = JSON.parse(obj).itemid*1;
        for (let i=0; i<=todos.length-1;i++){
          if (todos[i].id===id)
            todos.splice(i,1);
        }
      });
      req.on("end", ()=>{
        res.end(JSON.stringify(todos));
      });
  }
  else {
    fs.readFile("./public"+req.url, (err, data)=>{
      res.statusCode = 200;
      res.end(data);
    });
  }
}).listen(8080);