import { createClient } from "redis";

const client = createClient();

async function Worker () {
    await client.connect()
    while(1){
        const response = await client.brPop("submission", 0)
        console.log(response);
        
        await new Promise((resolve)=> setTimeout(resolve, 1000))
        console.log("Proceed user Submission");
        
    }
}

Worker()