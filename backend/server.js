const express =  require("express")
const cors =  require("cors")
require('dotenv').config()
const {PrismaClient} = require('@prisma/client')
const {PrismaPg} = require("@prisma/adapter-pg")
const {Pool} = require('pg')
const app = express()

app.use(cors())
app.use(express.json())


const pool =  new Pool ({
    connectionString : process.env.DATABASE_URL
})

const adapter = new PrismaPg (pool)

const prisma = new PrismaClient ({adapter})

app.get("/api/todos", async(req,res) => {
    try
    {   
        const todos = await prisma.todo.findMany({
            orderBy : {
                createdAt : 'desc'
            }
        })
        res.json({todos})
    }
    catch(error)
    {
        console.log("FETECH ERROR");
        res.status(500).json({ error: "Failed to fetch" })
    }
})

app.post('/api/todos', async(req,res) => {
    const {title} = req.body;
    if (!title || title.trim() === '')
    {
        return res.status(400).json({
            error : "Title is required!"
        })
    }

    try 
    {
        const newTodo  = await prisma.todo.create({
            data: {
                title : title.trim()
            }
        })
        res.status(201).json(newTodo);
    }
    catch (error)
    {
        console.log("CREATE ERROR!", error);
        res.status(500).json({
            error : "FAILED TO CREATE TODO"
        })
    }

})

app.put("/api/todos/:id",async(req,res) => {
    const {id} = req.params
    const {title, completed} = req.body
    try
    {
        const updatedTodo = await prisma.todo.update({
            where : {
                id : parseInt(id)
            },
            data:
            {
                title : title !== undefined ? title.trim() : undefined,
                completed : completed !== undefined ? completed : undefined
            }
        })
        res.json(updatedTodo)
    }
    catch(error)
    {
        console.log("UPDATE ERROR!  : ",error);
        res.status(500).json({error : "ERROR!"})
    }
    
})

app.delete("/api/todos/:id", async(req,res) => 
{
    const {id} = req.params;

    try 
    {
        await prisma.todo.delete(
            {
                where : {
                    id : parseInt (id)
                }
            }
        )
        res.json({message : "Todo deleted succesffuly!"})

    }
    catch (error)
    {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
})

app.listen(3000, () => {
    console.log("SERVER IS RUNNING ON PORT 3000")
})