require('dotenv').config();
const Discord = require("discord.js")
const client = new Discord.Client()
const mongoose = require("mongoose")
const Blog = require("./blog")
const db = "mongodb+srv://Amanbek:test123@cluster0.oc8yg.mongodb.net/BotsWords?retryWrites=true&w=majority"
let blog

mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(() => {
        console.log("Connected to db!")

        client.on("guildCreate", guild => {
            console.log("bot added to server")
                blog = new Blog(
                    {tabu:[]}
                )
            blog.set("tabu",["mal"])
        })
    })
    .catch(err => console.log(err))

const mySecret = process.env["DISCORD_TOKEN "]
const fetch = require("node-fetch")



client.on("ready",()=>{
    console.log(`Logged as ${client.user.tag}!`)
})

//let tabuWords = ["mal", "мал"]

function addTabuWords(tabuWord){
    let tabuWords = blog.get("tabu")
    tabuWords.push(tabuWord)

    blog.set("tabu",tabuWords)
    blog.save()
}

function deleteTabuWords(index){
    let tabuWords = blog.get("tabu")
    tabuWords.splice(index-1, 1)
    blog.set("tabu",tabuWords)
    blog.save()
}

function showTabuWords(){
    return blog.get("tabu").join(" ")
}

function getQuote(){
    return fetch("https://zenquotes.io/api/random")
        .then(res =>{
            return res.json()
        })
        .then(data => {
            return data[0]["q"] + " -" + data[0]["a"]
        })
}

client.on("message",msg =>{
    const message = msg.content

    if(message.startsWith("$new")){
        let newTabuWord = message.split(" ")[1]

        addTabuWords(newTabuWord)
        msg.channel.send("newtabu..." + " " + newTabuWord)
    }else if(message.startsWith("$delete")){
        let tabuIndex = parseInt(message.split(" ")[1])
        let tabuWords = blog.get("tabu")
        msg.channel.send("delte tabu..." + " " + tabuWords[tabuIndex - 1])
        deleteTabuWords(tabuIndex)

    }else if(message.startsWith("$show")){
        msg.channel.send(showTabuWords())
    }

    if(msg.content === "Nazik" ){
        msg.reply(msg.content + " Mazik")
    } else if(msg.content === "назик"){
        msg.reply("не мазик")
    }else if(msg.content === 'kotik'){
        msg.reply("kotik narkotik")
    }

    if(msg.author.bot) return

    if(message === "quote"){
        getQuote().then(quote=>{
            msg.channel.send(quote)
        })
    }

    if(blog.get("tabu").some(word => msg.content.toLowerCase().includes(word))){
        msg.delete({timeout:0})
            .then(msg.channel.send("Message has been deleted!"))
    }


})


client.login(mySecret)

