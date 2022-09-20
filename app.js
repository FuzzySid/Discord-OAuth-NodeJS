const express=require('express');
const axios=require('axios');

const PORT=8000;
const app=express();

app.get('/',(req,res)=>{
    res.send(`
        <div style="margin: 300px auto;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: sans-serif;"
        >
            <h3>Welcome to Discord OAuth NodeJS App</h3>
            <p>Click on the below button to get started!</p>
            <a 
                href="https://discord.com/api/oauth2/authorize?client_id=1003243740799959072&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fdiscord&response_type=code&scope=identify%20email"
                style="outline: none;
                padding: 10px;
                border: none;
                font-size: 20px;
                margin-top: 20px;
                border-radius: 8px;
                background: #6D81CD;
                cursor:pointer;
                text-decoration: none;
                color: white;"
            >
            Login with Discord</a>
        </div>
    `)
})

app.get('/auth/discord',async(req,res)=>{
    const code=req.query.code;
    const params = new URLSearchParams();
    let user;
    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', "http://localhost:8000/auth/discord");
    try{
        const response=await axios.post('https://discord.com/api/oauth2/token',params)
        const { access_token,token_type}=response.data;
        const userDataResponse=await axios.get('https://discord.com/api/users/@me',{
            headers:{
                authorization: `${token_type} ${access_token}`
            }
        })
        console.log('Data: ',userDataResponse.data)
        user={
            username:userDataResponse.data.username,
            email:userDataResponse.data.email,
            avatar:`https://cdn.discordapp.com/avatars/350284820586168321/80a993756f84e94536481f3f3c1eda16.png`

        }
        return res.send(`
            <div style="margin: 300px auto;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: sans-serif;"
            >
                <h3>Welcome ${user.username}</h3>
                <span>Email: ${user.email}</span>
                <p>Your Discord App is connected to NodeJS!</p>
                <img src="${user.avatar}"/>
            </div>
        `)
        
    }catch(error){
        console.log('Error',error)
        return res.send('Some error occurred! ')
    }
    
 
})

app.listen(PORT, ()=>{
    console.log(`App started on port ${PORT}`);
})

