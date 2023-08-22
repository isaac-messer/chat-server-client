const net = require('net');
const FileSystem =  require('fs');
const { v4: uuidv4 } = require('uuid');

const date = new Date().toString();
const password = 'Admin';
const port = 3001;

let serverSide = net.createServer((clientSide) => {
    clientSide.write(`Welcome to our Message Board\n`);

    const clientUsername = `User:${uuidv4()}`;
    clientSide.write(`Username is ${clientUsername}\n`);
    console.log(`${clientUsername} has connected\n`);

    activeClients.push(clientSide)

    for( const activeClient of activeClients) {
        if (activeClient !== clientSide) {
            activeClient.write(`${clientUsername} has Entered the Message Board`);
        }
    }

    FileSystem.writeFile(
        './chat.log', 
        `${date}: ${clientUsername} has Entered the Message Board\n`, 
        {flag: 'a'}, 
        (error) => { if(error) throw error}
    );
    
    clientSide.setEncoding('utf8');
    clientSide.on('data', (messagePackage) => {
        console.log(`Client Data: ${messagePackage}`);

        for( const activeClient of activeClients) {
            if(activeClient !== clientSide) {
                activeClient.write(`${clientUsername}: ${messagePackage}`);
            };
        };
        clientSide.write(`You said: ${messagePackage}`);
        FileSystem.writeFile(
            './chat.log',
            `${date}: ${clientUsername} said: ${messagePackage}\n\n`,
            {flag: 'a'},
            (error) => { if(error) throw error}
        );
    });

    clientSide.on('end', () => {
        for(const activeClient of activeClients) {
            if(activeClient !== clientSide) {
                activeClient.write(`${clientUsername} has Left the Message Board\n`)
            };
        };

        console.log(`${clientUsername} has disconnected\n`);
        FileSystem.writeFile(
            './chat.log',
            `${date}: ${clientUsername} has Left the Message Board\n`,
            {flag: 'a'},
            (error) => { if(error) throw error}
        );

        activeClients.splice(
            activeClients.findIndex(
                ({ clientSide: activeClient}) => activeClient === clientSide
            ), 1
        );
    });
});

const activeClients = [];

serverSide.listen(port, () => {
    console.log(`Server is live on port: ${port}`);
})


// Below was the first attepmt i made at completeing this project before knowing that net was required for completion.

// const express = require("express");
// const app = express();
// const http = require("http").createServer(app);
// const server = require("socket.io")(http);
// const fs = require('fs');

// const port = process.env.PORT || 3000;


// app.use(express.static("public"));

// server.on('connection', (client) => {-
//     console.log(`A user has connected`);
//     fs.writeFile('/Users/isaacmesser/Documents/development/school/node/node-projects/chat-server:client/chat.log', `--A User Has Connected--
// `, { flag: 'a+' }, err => {
//             if (err) {
//                 console.log(err);
//             }
//         });
    
//     client.on('disconnect', () => {
//         console.log(`User has disconnected`)
//         fs.writeFile('/Users/isaacmesser/Documents/development/school/node/node-projects/chat-server:client/chat.log', `--A User Has Disconnected--
// `, { flag: 'a+' }, err => {
//             if (err) {
//                 console.log(err);
//             }
//         })
//     })

//     client.on('sentServerMessage', (message) => {
//         server.emit('sentClientMessage', `${message.sender}:  ${message.text}`)
//         fs.writeFile('/Users/isaacmesser/Documents/development/school/node/node-projects/chat-server:client/chat.log', `${message.sender}:  ${message.text}
// `, { flag: 'a+' }, err => {
//             if (err) {
//                 console.log(err);
//             }
//         })
//     });
// });

// http.listen(port, () => {
//     console.log(`Server is live on port: ${port}`);
// })